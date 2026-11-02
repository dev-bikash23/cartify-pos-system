package com.cartify.service.impl;

import com.cartify.domain.OrderStatus;
import com.cartify.domain.PaymentType;
import com.cartify.mapper.OrderMapper;
import com.cartify.modal.Branch;
import com.cartify.modal.Customer;
import com.cartify.modal.Order;
import com.cartify.modal.OrderItem;
import com.cartify.modal.Product;
import com.cartify.modal.User;
import com.cartify.payload.dto.OrderDTO;
import com.cartify.payload.dto.OrderItemDTO;
import com.cartify.payload.dto.RazorpayCheckoutDTO;
import com.cartify.payload.dto.RazorpayVerificationRequest;
import com.cartify.repository.CustomerRepository;
import com.cartify.repository.OrderRepository;
import com.cartify.repository.ProductRepository;
import com.cartify.service.UserService;
import com.cartify.service.OrderPricingCalculator;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RazorpayPaymentService {

    private final UserService userService;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @Value("${razorpay.key-id:}")
    private String keyId;

    @Value("${razorpay.key-secret:}")
    private String keySecret;

    @Transactional
    public RazorpayCheckoutDTO createCheckoutOrder(OrderDTO request) throws Exception {
        requireCredentials();
        if (request.getPaymentType() != PaymentType.CARD && request.getPaymentType() != PaymentType.UPI) {
            throw new IllegalArgumentException("Razorpay checkout supports card or UPI payments");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("An order must contain at least one item");
        }

        User cashier = userService.getCurrentUser();
        Branch branch = cashier.getBranch();
        if (branch == null) {
            throw new IllegalStateException("Cashier branch was not found");
        }

        Customer customer = request.getCustomerId() == null ? null :
                customerRepository.findById(request.getCustomerId())
                        .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        List<OrderItem> items = request.getItems().stream()
                .map(this::toOrderItem)
                .toList();
        BigDecimal total = items.stream()
                .map(item -> BigDecimal.valueOf(item.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        OrderPricingCalculator.PriceBreakdown pricing = OrderPricingCalculator.calculate(
            total, request.getDiscountType(), request.getDiscountValue()
        );
        int amountInPaise = BigDecimal.valueOf(pricing.totalAmount())
            .movePointRight(2).intValueExact();
        if (amountInPaise <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }

        JSONObject gatewayRequest = new JSONObject()
                .put("amount", amountInPaise)
                .put("currency", "INR")
                .put("receipt", "pos-" + UUID.randomUUID());
        final com.razorpay.Order gatewayOrder;
        try {
            gatewayOrder = new RazorpayClient(keyId.trim(), keySecret.trim()).orders.create(gatewayRequest);
        } catch (RazorpayException exception) {
            if (exception.getMessage() != null
                    && exception.getMessage().toLowerCase().contains("authentication failed")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Razorpay rejected the configured credentials. Use a matching Razorpay test key and secret."
                );
            }
            throw exception;
        }

        Order order = Order.builder()
                .branch(branch)
                .cashier(cashier)
                .customer(customer)
                .paymentType(request.getPaymentType())
                .status(OrderStatus.PENDING)
                .totalAmount(pricing.totalAmount())
                .taxAmount(pricing.taxAmount())
                .discountAmount(pricing.discountAmount())
                .items(items)
                .razorpayOrderId(gatewayOrder.get("id"))
                .build();
        items.forEach(item -> item.setOrder(order));
        Order savedOrder = orderRepository.save(order);

        return new RazorpayCheckoutDTO(
                savedOrder.getId(),
                gatewayOrder.get("id"),
                amountInPaise,
                "INR",
                keyId
        );
    }

    @Transactional
    public OrderDTO verifyPayment(RazorpayVerificationRequest request) throws Exception {
        requireCredentials();
        User cashier = userService.getCurrentUser();
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (order.getCashier() == null || !order.getCashier().getId().equals(cashier.getId())) {
            throw new SecurityException("This payment does not belong to the current cashier");
        }
        if (!order.getRazorpayOrderId().equals(request.razorpayOrderId())) {
            throw new SecurityException("Payment order reference does not match");
        }
        if (order.getStatus() == OrderStatus.COMPLETED) {
            if (request.razorpayPaymentId().equals(order.getRazorpayPaymentId())) {
                return OrderMapper.toDTO(order);
            }
            throw new IllegalStateException("Order has already been paid");
        }

        String signedPayload = request.razorpayOrderId() + "|" + request.razorpayPaymentId();
        if (!Utils.verifySignature(signedPayload, request.razorpaySignature(), keySecret)) {
            throw new SecurityException("Payment signature is invalid");
        }

        com.razorpay.Payment payment = new RazorpayClient(keyId, keySecret)
                .payments.fetch(request.razorpayPaymentId());
        int expectedAmount = BigDecimal.valueOf(order.getTotalAmount())
            .movePointRight(2).intValueExact();
        int capturedAmount = new BigDecimal(String.valueOf(payment.get("amount")))
            .intValueExact();
        if (!request.razorpayOrderId().equals(payment.get("order_id")) ||
            !"captured".equals(payment.get("status")) ||
            !"INR".equals(payment.get("currency")) ||
            expectedAmount != capturedAmount) {
            throw new IllegalStateException("Razorpay has not confirmed a captured payment");
        }

        order.setRazorpayPaymentId(request.razorpayPaymentId());
        order.setStatus(OrderStatus.COMPLETED);
        return OrderMapper.toDTO(orderRepository.save(order));
    }

    private OrderItem toOrderItem(OrderItemDTO requestedItem) {
        if (requestedItem.getProductId() == null || requestedItem.getQuantity() == null ||
                requestedItem.getQuantity() <= 0) {
            throw new IllegalArgumentException("Each item needs a product and a positive quantity");
        }
        Product product = productRepository.findById(requestedItem.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        BigDecimal lineTotal = BigDecimal.valueOf(product.getSellingPrice())
                .multiply(BigDecimal.valueOf(requestedItem.getQuantity()))
                .setScale(2, RoundingMode.HALF_UP);
        return OrderItem.builder()
                .product(product)
                .quantity(requestedItem.getQuantity())
                .price(lineTotal.doubleValue())
                .build();
    }

    private void requireCredentials() {
        if (keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Card/UPI payments are unavailable. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
            );
        }
    }
}