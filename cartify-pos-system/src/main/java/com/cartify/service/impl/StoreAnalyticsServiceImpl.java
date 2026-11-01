package com.cartify.service.impl;

import com.cartify.modal.Order;
import com.cartify.modal.OrderItem;
import com.cartify.modal.Branch;
import com.cartify.domain.OrderStatus;
import com.cartify.domain.PaymentType;
import com.cartify.modal.Store;
import com.cartify.payload.dto.MonthlySalesDTO;
import com.cartify.payload.dto.RecentOrderDTO;
import com.cartify.payload.dto.RecentSalesDTO;
import com.cartify.payload.dto.StoreOverviewDTO;
import com.cartify.repository.BranchRepository;
import com.cartify.repository.InventoryRepository;
import com.cartify.repository.OrderRepository;
import com.cartify.repository.ProductRepository;
import com.cartify.repository.StoreRepository;
import com.cartify.repository.UserRepository;
import com.cartify.service.StoreAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreAnalyticsServiceImpl implements StoreAnalyticsService {

    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
        private final InventoryRepository inventoryRepository;

        private static final int LOW_STOCK_THRESHOLD = 10;

    @Override
    public StoreOverviewDTO getStoreOverview(Long storeId) throws Exception {
        Store store = storeRepository.findById(storeId).orElseThrow(
                () -> new Exception("store not found")
        );

        long totalBranches = branchRepository.findByStoreId(storeId).size();
        long totalProducts = productRepository.findByStoreIdAndActiveTrue(storeId).size();

        Double totalSales = completedOrders(storeId).stream()
                .mapToDouble(order -> order.getTotalAmount() == null ? 0.0 : order.getTotalAmount())
                .sum();
        Long totalEmployees = userRepository.countEmployeesByStoreId(storeId);

        return StoreOverviewDTO.builder()
                .totalSales(totalSales != null ? totalSales : 0.0)
                .totalBranches(totalBranches)
                .totalProducts(totalProducts)
                .totalEmployees(totalEmployees != null ? totalEmployees : 0L)
                .build();
    }

    @Override
    public RecentSalesDTO getRecentSales(Long storeId) throws Exception {
        storeRepository.findById(storeId).orElseThrow(
                () -> new Exception("store not found")
        );

        List<Order> recentOrders = orderRepository.findTop5ByBranch_Store_IdOrderByCreatedAtDesc(storeId).stream()
                .filter(this::isCompleted)
                .toList();

        List<RecentOrderDTO> recentOrderDTOs = recentOrders.stream()
                .map(order -> RecentOrderDTO.builder()
                        .id(order.getId())
                        .branchName(order.getBranch() != null ? order.getBranch().getName() : "—")
                        .totalAmount(order.getTotalAmount())
                        .createdAt(order.getCreatedAt())
                        .status(order.getStatus() != null ? order.getStatus().name() : null)
                        .build())
                .collect(Collectors.toList());

        // Rolling last-7-days window rather than "today only" — stays
        // meaningful even on days with no fresh orders.
        LocalDateTime endOfRange = LocalDate.now().plusDays(1).atStartOfDay();
        LocalDateTime startOfRange = endOfRange.minusDays(7);

        List<Order> periodOrders = completedOrders(storeId).stream()
                .filter(order -> order.getCreatedAt() != null
                        && !order.getCreatedAt().isBefore(startOfRange)
                        && order.getCreatedAt().isBefore(endOfRange))
                .toList();
        Double periodRevenue = periodOrders.stream()
                .mapToDouble(order -> order.getTotalAmount() == null ? 0.0 : order.getTotalAmount()).sum();
        Long periodTransactions = (long) periodOrders.size();

        return RecentSalesDTO.builder()
                .recentOrders(recentOrderDTOs)
                .todaysRevenue(periodRevenue != null ? periodRevenue : 0.0)
                .todaysTransactions(periodTransactions != null ? periodTransactions : 0L)
                .build();
    }

    @Override
    public List<MonthlySalesDTO> getMonthlySales(Long storeId) throws Exception {
        storeRepository.findById(storeId).orElseThrow(
                () -> new Exception("store not found")
        );

        // Last 12 months, oldest first, including the current month
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime rangeStart = currentMonth.minusMonths(11).atDay(1).atStartOfDay();
        LocalDateTime rangeEnd = currentMonth.plusMonths(1).atDay(1).atStartOfDay();

        List<Order> orders = orderRepository.findByBranch_Store_IdAndCreatedAtBetween(
                storeId, rangeStart, rangeEnd
        ).stream().filter(this::isCompleted).toList();

        Map<YearMonth, Double> totalsByMonth = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> YearMonth.from(order.getCreatedAt()),
                        Collectors.summingDouble(order ->
                                order.getTotalAmount() != null ? order.getTotalAmount() : 0.0
                        )
                ));

        List<MonthlySalesDTO> result = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            YearMonth ym = currentMonth.minusMonths(i);
            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            Double sales = totalsByMonth.getOrDefault(ym, 0.0);
            result.add(MonthlySalesDTO.builder().month(label).sales(sales).build());
        }

        return result;
    }

        @Override
        public List<Map<String, Object>> getDailySales(Long storeId) throws Exception {
                return getSalesTrends(storeId, "week");
        }

        @Override
        public List<Map<String, Object>> getSalesTrends(Long storeId, String period) throws Exception {
                requireStore(storeId);
                String normalized = period == null ? "month" : period.toLowerCase(Locale.ROOT);
                LocalDate today = LocalDate.now();
                List<Map<String, Object>> result = new ArrayList<>();
                if (normalized.equals("year") || normalized.equals("yearly")) {
                        YearMonth currentMonth = YearMonth.now();
                        List<Order> orders = completedOrders(storeId);
                        for (int offset = 11; offset >= 0; offset--) {
                                YearMonth month = currentMonth.minusMonths(offset);
                                List<Order> monthOrders = orders.stream()
                                                .filter(order -> order.getCreatedAt() != null
                                                                && YearMonth.from(order.getCreatedAt()).equals(month))
                                                .toList();
                                result.add(trendPoint(month.atDay(1), month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), monthOrders));
                        }
                        return result;
                }

                int days = normalized.equals("week") || normalized.equals("weekly") ? 7 : 30;
                LocalDateTime start = today.minusDays(days - 1L).atStartOfDay();
                List<Order> orders = completedOrders(storeId).stream()
                                .filter(order -> order.getCreatedAt() != null && !order.getCreatedAt().isBefore(start))
                                .toList();
                for (int offset = days - 1; offset >= 0; offset--) {
                        LocalDate date = today.minusDays(offset);
                        List<Order> dayOrders = orders.stream()
                                        .filter(order -> order.getCreatedAt().toLocalDate().equals(date))
                                        .toList();
                        result.add(trendPoint(date, date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), dayOrders));
                }
                return result;
        }

        @Override
        public List<Map<String, Object>> getSalesByCategory(Long storeId) throws Exception {
                Map<Long, Map<String, Object>> totals = new LinkedHashMap<>();
                completedOrders(storeId).stream()
                                .filter(order -> order.getCreatedAt() != null
                                                && order.getCreatedAt().toLocalDate().equals(LocalDate.now()))
                                .filter(order -> order.getItems() != null)
                                .flatMap(order -> order.getItems().stream())
                                .filter(item -> item.getProduct() != null && item.getProduct().getCategory() != null)
                                .forEach(item -> {
                                        Long categoryId = item.getProduct().getCategory().getId();
                                        Map<String, Object> category = totals.computeIfAbsent(categoryId, ignored -> {
                                                Map<String, Object> values = new LinkedHashMap<>();
                                                values.put("categoryId", categoryId);
                                                values.put("categoryName", item.getProduct().getCategory().getName());
                                                values.put("quantitySold", 0);
                                                values.put("totalSales", 0.0);
                                                return values;
                                        });
                                        category.put("quantitySold", ((Number) category.get("quantitySold")).intValue()
                                                        + (item.getQuantity() == null ? 0 : item.getQuantity()));
                                        category.put("totalSales", ((Number) category.get("totalSales")).doubleValue()
                                                        + (item.getPrice() == null ? 0.0 : item.getPrice()));
                                });
                return totals.values().stream()
                                .sorted((left, right) -> Double.compare(
                                                ((Number) right.get("totalSales")).doubleValue(),
                                                ((Number) left.get("totalSales")).doubleValue()))
                                .toList();
        }

        @Override
        public List<Map<String, Object>> getSalesByPaymentMethod(Long storeId) throws Exception {
                Map<PaymentType, List<Order>> groups = new java.util.EnumMap<>(PaymentType.class);
                completedOrders(storeId).stream()
                                .filter(order -> order.getPaymentType() != null)
                                .forEach(order -> groups.computeIfAbsent(order.getPaymentType(), ignored -> new ArrayList<>()).add(order));
                double total = completedOrders(storeId).stream()
                                .mapToDouble(order -> order.getTotalAmount() == null ? 0.0 : order.getTotalAmount()).sum();
                return groups.entrySet().stream().map(entry -> {
                        double amount = entry.getValue().stream()
                                        .mapToDouble(order -> order.getTotalAmount() == null ? 0.0 : order.getTotalAmount()).sum();
                        Map<String, Object> row = new LinkedHashMap<>();
                        row.put("type", entry.getKey().name());
                        row.put("paymentType", entry.getKey().name());
                        row.put("totalAmount", amount);
                        row.put("transactionCount", entry.getValue().size());
                        row.put("percentage", total == 0 ? 0.0 : Math.round(amount * 10000 / total) / 100.0);
                        return row;
                }).toList();
        }

        @Override
        public List<Map<String, Object>> getSalesByBranch(Long storeId) throws Exception {
                Map<Long, Map<String, Object>> totals = new LinkedHashMap<>();
                completedOrders(storeId).stream().filter(order -> order.getBranch() != null).forEach(order -> {
                        Branch branch = order.getBranch();
                        Map<String, Object> row = totals.computeIfAbsent(branch.getId(), ignored -> {
                                Map<String, Object> values = new LinkedHashMap<>();
                                values.put("branchId", branch.getId());
                                values.put("branchName", branch.getName());
                                values.put("totalSales", 0.0);
                                values.put("totalRevenue", 0.0);
                                values.put("transactionCount", 0);
                                return values;
                        });
                        double amount = order.getTotalAmount() == null ? 0.0 : order.getTotalAmount();
                        row.put("totalSales", ((Number) row.get("totalSales")).doubleValue() + amount);
                        row.put("totalRevenue", ((Number) row.get("totalRevenue")).doubleValue() + amount);
                        row.put("transactionCount", ((Number) row.get("transactionCount")).intValue() + 1);
                });
                return totals.values().stream()
                                .sorted((left, right) -> Double.compare(
                                                ((Number) right.get("totalSales")).doubleValue(),
                                                ((Number) left.get("totalSales")).doubleValue()))
                                .toList();
        }

        @Override
        public List<Map<String, Object>> getBranchPerformance(Long storeId) throws Exception {
                return getSalesByBranch(storeId);
        }

        private Map<String, Object> trendPoint(LocalDate date, String label, List<Order> orders) {
                Map<String, Object> point = new LinkedHashMap<>();
                point.put("date", date.toString());
                point.put("label", label);
                point.put("sales", orders.stream().mapToDouble(order -> order.getTotalAmount() == null ? 0.0 : order.getTotalAmount()).sum());
                point.put("totalSales", point.get("sales"));
                point.put("transactions", orders.size());
                point.put("units", orders.stream().filter(order -> order.getItems() != null)
                                .flatMap(order -> order.getItems().stream())
                                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity()).sum());
                return point;
        }

        private List<Order> completedOrders(Long storeId) throws Exception {
                requireStore(storeId);
                return orderRepository.findByBranch_Store_Id(storeId).stream()
                                .filter(this::isCompleted)
                                .toList();
        }

        private void requireStore(Long storeId) throws Exception {
                storeRepository.findById(storeId).orElseThrow(() -> new Exception("store not found"));
        }

        private boolean isCompleted(Order order) {
                return order.getStatus() == OrderStatus.COMPLETED;
        }

        @Override
        public List<Map<String, Object>> getStoreAlerts(Long storeId) throws Exception {
                storeRepository.findById(storeId).orElseThrow(
                                () -> new Exception("store not found")
                );

                Map<Long, Map<String, Object>> stockByProduct = new LinkedHashMap<>();
                inventoryRepository.findByProduct_Store_Id(storeId).forEach(inventory -> {
                        if (inventory.getProduct() == null || !inventory.getProduct().isActive()) {
                                return;
                        }

                        Long productId = inventory.getProduct().getId();
                        Map<String, Object> alert = stockByProduct.computeIfAbsent(productId, id -> {
                                Map<String, Object> item = new HashMap<>();
                                item.put("productId", id);
                                item.put("productName", inventory.getProduct().getName());
                                item.put("sku", inventory.getProduct().getSku());
                                item.put("quantity", 0);
                                return item;
                        });
                        int quantity = (Integer) alert.get("quantity");
                        alert.put("quantity", quantity + (inventory.getQuantity() == null ? 0 : inventory.getQuantity()));
                });

                LocalDate today = LocalDate.now();
                LocalDateTime start = today.minusDays(6).atStartOfDay();
                LocalDateTime end = today.plusDays(1).atStartOfDay();
                List<Order> completedOrders = orderRepository
                        .findByBranch_Store_IdAndCreatedAtBetween(storeId, start, end)
                        .stream()
                        .filter(order -> order.getStatus() != null && order.getStatus().name().equals("COMPLETED"))
                        .toList();

                Map<Long, Integer> soldLast7Days = new HashMap<>();
                completedOrders.stream()
                        .flatMap(order -> order.getItems() == null
                                ? java.util.stream.Stream.<OrderItem>empty()
                                : order.getItems().stream())
                        .filter(item -> item.getProduct() != null && item.getProduct().getId() != null)
                        .forEach(item -> soldLast7Days.merge(
                                item.getProduct().getId(),
                                item.getQuantity() == null ? 0 : item.getQuantity(),
                                Integer::sum
                        ));

                stockByProduct.values().forEach(alert -> {
                    Long productId = (Long) alert.get("productId");
                    int currentStock = (Integer) alert.get("quantity");
                    int sold = soldLast7Days.getOrDefault(productId, 0);
                    double dailySales = sold / 7.0;
                    int safeStock = Math.max(LOW_STOCK_THRESHOLD, (int) Math.ceil(dailySales * 14));
                    int reorderQuantity = Math.max(0, safeStock - currentStock);
                    boolean overstock = currentStock > Math.max(safeStock * 2, 40);

                    alert.put("soldLast7Days", sold);
                    alert.put("dailySalesAverage", Math.round(dailySales * 100.0) / 100.0);
                    alert.put("safeStock", safeStock);
                    alert.put("reorderQuantity", reorderQuantity);
                    alert.put("daysOfCover", dailySales == 0 ? null : Math.round(currentStock / dailySales * 10.0) / 10.0);
                    alert.put("status", currentStock == 0 ? "OUT_OF_STOCK" : overstock ? "OVERSTOCK" : currentStock < safeStock ? "LOW_STOCK" : "HEALTHY");
                    alert.put("severity", currentStock == 0 ? "CRITICAL" : currentStock < safeStock ? "WARNING" : overstock ? "INFO" : "OK");
                    alert.put("title", currentStock == 0 ? "Out of stock" : overstock ? "High stock" : currentStock < safeStock ? "Low stock" : "Healthy stock");
                    alert.put("message", currentStock == 0
                            ? alert.get("productName") + " is out of stock."
                            : overstock
                            ? alert.get("productName") + " has more stock than its recent sales require."
                            : currentStock < safeStock
                            ? alert.get("productName") + " needs " + reorderQuantity + " more units to reach safe stock."
                            : alert.get("productName") + " is within the safe stock range.");
                });

                return stockByProduct.values().stream().toList();
        }

            @Override
            public List<Map<String, Object>> getStoreSalesLast7Days(Long storeId) throws Exception {
                storeRepository.findById(storeId).orElseThrow(() -> new Exception("store not found"));
                LocalDate today = LocalDate.now();
                List<Order> orders = orderRepository.findByBranch_Store_IdAndCreatedAtBetween(
                        storeId, today.minusDays(6).atStartOfDay(), today.plusDays(1).atStartOfDay()
                ).stream()
                        .filter(order -> order.getStatus() != null && order.getStatus().name().equals("COMPLETED"))
                        .toList();

                List<Map<String, Object>> result = new ArrayList<>();
                for (int offset = 6; offset >= 0; offset--) {
                    LocalDate date = today.minusDays(offset);
                    int units = orders.stream()
                            .filter(order -> order.getCreatedAt() != null && order.getCreatedAt().toLocalDate().equals(date))
                            .flatMap(order -> order.getItems() == null
                                    ? java.util.stream.Stream.<OrderItem>empty()
                                    : order.getItems().stream())
                            .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                            .sum();
                    double revenue = orders.stream()
                            .filter(order -> order.getCreatedAt() != null && order.getCreatedAt().toLocalDate().equals(date))
                            .mapToDouble(order -> order.getTotalAmount() == null ? 0 : order.getTotalAmount())
                            .sum();
                    Map<String, Object> day = new LinkedHashMap<>();
                    day.put("date", date.toString());
                    day.put("label", date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                            + " " + date.getMonthValue() + "/" + date.getDayOfMonth());
                    day.put("units", units);
                    day.put("revenue", revenue);
                    result.add(day);
                }
                return result;
            }
}