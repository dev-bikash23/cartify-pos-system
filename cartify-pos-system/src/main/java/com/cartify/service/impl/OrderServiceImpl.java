package com.cartify.service.impl;

import com.cartify.domain.OrderStatus;
import com.cartify.domain.PaymentType;
import com.cartify.mapper.OrderMapper;
import com.cartify.modal.*;
import com.cartify.payload.dto.OrderDTO;
import com.cartify.repository.CustomerRepository;
import com.cartify.repository.OrderRepository;
import com.cartify.repository.ProductRepository;
import com.cartify.service.OrderService;
import com.cartify.service.OrderPricingCalculator;
import com.cartify.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserService userService;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository; // ✅ added

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) throws Exception {
                if (orderDTO.getPaymentType() != PaymentType.CASH) {
                        throw new IllegalArgumentException(
                                        "Card and UPI payments must be confirmed by the payment provider"
                        );
                }

        User cashier = userService.getCurrentUser();
        Branch branch = cashier.getBranch();
        if (branch == null) {
            throw new Exception("cashier's branch not found");
        }

        // ✅ fetch the actual Customer entity using the incoming customerId,
        // instead of relying on orderDTO.getCustomer() which is never populated by the JSON body
        Customer customer = null;
        if (orderDTO.getCustomerId() != null) {
            customer = customerRepository.findById(orderDTO.getCustomerId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Customer not found with id " + orderDTO.getCustomerId()));
        }

        List<OrderItem> orderItems = orderDTO.getItems().stream()
                .map(itemDto -> {
                    Product product = productRepository.findById(itemDto.getProductId())
                            .orElseThrow(() -> new EntityNotFoundException("product not found"));
                    return OrderItem.builder()
                            .product(product)
                            .quantity(itemDto.getQuantity())
                            .price(product.getSellingPrice() * itemDto.getQuantity())
                            .build();
                })
                .toList();
        BigDecimal subtotal = orderItems.stream()
                .map(item -> BigDecimal.valueOf(item.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        OrderPricingCalculator.PriceBreakdown pricing = OrderPricingCalculator.calculate(
                subtotal, orderDTO.getDiscountType(), orderDTO.getDiscountValue()
        );

        Order order = Order.builder()
                .branch(branch)
                .cashier(cashier)
                .customer(customer) // ✅ now set from the fetched entity, not orderDTO.getCustomer()
                .paymentType(orderDTO.getPaymentType())
                .status(OrderStatus.COMPLETED)
                .totalAmount(pricing.totalAmount())
                .taxAmount(pricing.taxAmount())
                .discountAmount(pricing.discountAmount())
                .items(orderItems)
                .build();
        orderItems.forEach(item -> item.setOrder(order));

        for (OrderItem item : orderItems) {
            System.out.println("Product = " + item.getProduct());
            System.out.println("Product ID = " +
                    (item.getProduct() != null ? item.getProduct().getId() : "NULL"));
        }
        Order saveOrder = orderRepository.save(order);
        return OrderMapper.toDTO(saveOrder);
    }

    @Override
    public OrderDTO getOrderById(Long id) throws Exception {
        return orderRepository.findById(id)
                .map(OrderMapper::toDTO)
                .orElseThrow(
                        () -> new Exception("order not found with id " + id)
                );
    }

    @Override
    public List<OrderDTO> getOrdersByBranch(Long branchId,
                                            Long customerId,
                                            Long cashierId,
                                            PaymentType paymentType,
                                            OrderStatus orderStatus) throws Exception {
        return orderRepository.findByBranchId(branchId).stream()
                .filter(order -> customerId == null ||
                        (order.getCustomer() != null &&
                                order.getCustomer().getId().equals(customerId)))
                .filter(order -> cashierId == null ||
                        order.getCashier() != null &&
                                order.getCashier().getId().equals(cashierId))
                .filter(order -> paymentType == null ||
                        order.getPaymentType() == paymentType)
                .filter(order -> orderStatus == null ||
                        order.getStatus() == orderStatus)
                .map(OrderMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrderByCashier(Long cashierId) {
        return orderRepository.findByCashierId(cashierId).stream()
                .map(OrderMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long id) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new Exception("Order not found with id " + id)
        );

        if (order.getItems() != null) {
            order.getItems().clear();
        }

        if (order.getRefunds() != null) {
            order.getRefunds().clear();
        }

        orderRepository.delete(order);
    }

    @Override
    public List<OrderDTO> getTodaysOrderByBranch(Long branchId) throws Exception {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return orderRepository.findByBranchIdAndCreatedAtBetween(
                branchId, start, end
        ).stream().map(
                OrderMapper::toDTO
        ).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByCustomerId(Long customerId) throws Exception {
        return orderRepository.findByCustomerId(customerId)
                .stream().map(
                        OrderMapper::toDTO
                ).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getTop5RecentOrdersByBranchId(Long branchId) throws Exception {
        return orderRepository.findTop5ByBranchIdOrderByCreatedAtDesc(branchId)
                .stream().map(
                        OrderMapper::toDTO
                ).collect(Collectors.toList());
    }
}