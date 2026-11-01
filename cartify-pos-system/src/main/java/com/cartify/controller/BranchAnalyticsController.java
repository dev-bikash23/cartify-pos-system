package com.cartify.controller;

import com.cartify.domain.OrderStatus;
import com.cartify.domain.PaymentType;
import com.cartify.modal.Order;
import com.cartify.modal.OrderItem;
import com.cartify.repository.InventoryRepository;
import com.cartify.repository.OrderRepository;
import com.cartify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/branch-analytics")
public class BranchAnalyticsController {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;

    @GetMapping("/today-overview")
    public ResponseEntity<Map<String, Object>> getTodayOverview(@RequestParam Long branchId) {
        List<Order> orders = getCompletedOrdersForDate(branchId, LocalDate.now());
        double totalSales = orders.stream()
                .mapToDouble(order -> order.getTotalAmount() == null ? 0 : order.getTotalAmount())
                .sum();

        Map<String, Object> overview = new LinkedHashMap<>();
        overview.put("totalSales", totalSales);
        overview.put("salesGrowth", 0);
        overview.put("ordersToday", orders.size());
        overview.put("orderGrowth", 0);
        overview.put("activeCashiers", userRepository.findByBranchId(branchId).stream()
                .filter(user -> user.getRole() != null && user.getRole().name().equals("ROLE_BRANCH_CASHIER"))
                .count());
        overview.put("cashierGrowth", 0);
        overview.put("lowStockItems", inventoryRepository.findByBranchId(branchId).stream()
                .filter(inventory -> inventory.getQuantity() != null
                        && inventory.getQuantity() <= LOW_STOCK_THRESHOLD)
                .count());
        overview.put("lowStockGrowth", 0);

        return ResponseEntity.ok(overview);
    }

    @GetMapping("/payment-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getPaymentBreakdown(
            @RequestParam Long branchId,
            @RequestParam LocalDate date) {
        List<Order> orders = getCompletedOrdersForDate(branchId, date);
        double totalAmount = orders.stream()
                .mapToDouble(order -> order.getTotalAmount() == null ? 0 : order.getTotalAmount())
                .sum();
        Map<PaymentType, List<Order>> ordersByPayment = new EnumMap<>(PaymentType.class);
        for (PaymentType paymentType : PaymentType.values()) {
            ordersByPayment.put(paymentType, new ArrayList<>());
        }
        orders.forEach(order -> {
            if (order.getPaymentType() != null) {
                ordersByPayment.get(order.getPaymentType()).add(order);
            }
        });

        List<Map<String, Object>> breakdown = new ArrayList<>();
        ordersByPayment.forEach((paymentType, paymentOrders) -> {
            double amount = paymentOrders.stream()
                    .mapToDouble(order -> order.getTotalAmount() == null ? 0 : order.getTotalAmount())
                    .sum();
            Map<String, Object> payment = new LinkedHashMap<>();
            payment.put("type", paymentType.name());
            payment.put("transactionCount", paymentOrders.size());
            payment.put("totalAmount", amount);
            payment.put("percentage", totalAmount == 0 ? 0 : Math.round(amount * 10000 / totalAmount) / 100.0);
            breakdown.add(payment);
        });

        return ResponseEntity.ok(breakdown);
    }
    @GetMapping("/top-cashier")
    public ResponseEntity<List<Map<String, Object>>> getTopCashiers(
            @RequestParam Long branchId) {

        Map<Long, Map<String, Object>> cashierTotals = new LinkedHashMap<>();

        orderRepository.findByBranchId(branchId).stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .filter(order -> order.getCashier() != null)
                .forEach(order -> {
                    Long cashierId = order.getCashier().getId();

                    Map<String, Object> cashier = cashierTotals.computeIfAbsent(
                            cashierId,
                            ignored -> {
                                Map<String, Object> values = new LinkedHashMap<>();
                                values.put("cashierName", order.getCashier().getFullName());
                                values.put("totalRevenue", 0.0);
                                return values;
                            }
                    );

                    double revenue = order.getTotalAmount() == null
                            ? 0
                            : order.getTotalAmount();

                    cashier.put(
                            "totalRevenue",
                            (Double) cashier.get("totalRevenue") + revenue
                    );
                });

        return ResponseEntity.ok(
                cashierTotals.values().stream()
                        .sorted((first, second) ->
                                Double.compare(
                                        (Double) second.get("totalRevenue"),
                                        (Double) first.get("totalRevenue")
                                )
                        )
                        .limit(5)
                        .toList()
        );
    }

    @GetMapping("/daily-sales")
    public ResponseEntity<List<Map<String, Object>>> getDailySales(
            @RequestParam Long branchId,
            @RequestParam(defaultValue = "7") int days) {
        List<Map<String, Object>> dailySales = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int offset = days - 1; offset >= 0; offset--) {
            LocalDate date = today.minusDays(offset);
            double totalSales = getCompletedOrdersForDate(branchId, date).stream()
                    .mapToDouble(order -> order.getTotalAmount() == null ? 0 : order.getTotalAmount())
                    .sum();
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", date.toString());
            entry.put("totalSales", totalSales);
            dailySales.add(entry);
        }
        return ResponseEntity.ok(dailySales);
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts(@RequestParam Long branchId) {
        Map<Long, Map<String, Object>> productTotals = new LinkedHashMap<>();
        orderRepository.findByBranchId(branchId).stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .flatMap(order -> order.getItems() == null
                        ? java.util.stream.Stream.empty()
                        : order.getItems().stream())
                .forEach(item -> addProductTotal(productTotals, item));
        return ResponseEntity.ok(productTotals.values().stream()
                .sorted((first, second) -> Double.compare(
                        (Double) second.get("revenue"), (Double) first.get("revenue")))
                .limit(5)
                .toList());
    }

    @GetMapping("/category-sales")
    public ResponseEntity<List<Map<String, Object>>> getCategorySales(
            @RequestParam Long branchId,
            @RequestParam LocalDate date) {
        Map<Long, Map<String, Object>> categoryTotals = new LinkedHashMap<>();

        getCompletedOrdersForDate(branchId, date).forEach(order -> {
            if (order.getItems() == null || order.getItems().isEmpty()) {
                return;
            }

            order.getItems().forEach(item -> {
                if (item.getProduct() == null || item.getProduct().getCategory() == null) {
                    return;
                }

                Long categoryId = item.getProduct().getCategory().getId();
                if (categoryId == null) {
                    return;
                }

                Map<String, Object> category = categoryTotals.computeIfAbsent(categoryId, ignored -> {
                    Map<String, Object> values = new LinkedHashMap<>();
                    values.put("categoryId", categoryId);
                    values.put("categoryName", item.getProduct().getCategory().getName());
                    values.put("quantitySold", 0);
                    values.put("totalSales", 0.0);
                    return values;
                });

                int quantity = item.getQuantity() == null ? 0 : item.getQuantity();
                double revenue = item.getPrice() == null ? 0 : item.getPrice();

                category.put("quantitySold", ((Number) category.get("quantitySold")).intValue() + quantity);
                category.put("totalSales", ((Number) category.get("totalSales")).doubleValue() + revenue);
            });
        });

        return ResponseEntity.ok(categoryTotals.values().stream()
                .sorted((first, second) -> Double.compare(
                        ((Number) second.get("totalSales")).doubleValue(),
                        ((Number) first.get("totalSales")).doubleValue()))
                .toList());
    }

    private void addProductTotal(Map<Long, Map<String, Object>> productTotals, OrderItem item) {
        if (item.getProduct() == null || item.getProduct().getId() == null) return;
        Long productId = item.getProduct().getId();
        Map<String, Object> product = productTotals.computeIfAbsent(productId, ignored -> {
            Map<String, Object> values = new LinkedHashMap<>();
            values.put("productName", item.getProduct().getName());
            values.put("quantity", 0);
            values.put("revenue", 0.0);
            return values;
        });
        int quantity = item.getQuantity() == null ? 0 : item.getQuantity();
        double revenue = item.getPrice() == null ? 0 : item.getPrice();
        product.put("quantity", (Integer) product.get("quantity") + quantity);
        product.put("revenue", (Double) product.get("revenue") + revenue);
    }

    private List<Order> getCompletedOrdersForDate(Long branchId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return orderRepository.findByBranchIdAndCreatedAtBetween(branchId, start, end).stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .toList();
    }
}
