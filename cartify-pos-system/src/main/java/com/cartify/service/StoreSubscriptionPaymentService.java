package com.cartify.service;

import com.cartify.domain.UserRole;
import com.cartify.modal.Store;
import com.cartify.modal.StoreSubscription;
import com.cartify.modal.SubscriptionPlan;
import com.cartify.payload.dto.SubscriptionCheckoutDTO;
import com.cartify.payload.dto.SubscriptionVerificationRequest;
import com.cartify.repository.StoreSubscriptionRepository;
import com.cartify.repository.SubscriptionPlanRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StoreSubscriptionPaymentService {

    private final SubscriptionPlanRepository planRepository;
    private final StoreSubscriptionRepository subscriptionRepository;

    @Value("${razorpay.key-id:}")
    private String keyId;

    @Value("${razorpay.key-secret:}")
    private String keySecret;

    @Transactional
    public SubscriptionCheckoutDTO createCheckout(Store store, Long planId) throws Exception {
        requireCredentials();
        SubscriptionPlan plan = planRepository.findById(planId)
                .filter(item -> "Active".equalsIgnoreCase(item.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active plan not found"));
        if (plan.getPrice() == null || plan.getPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plan price must be greater than zero");
        }

        int amount = BigDecimal.valueOf(plan.getPrice()).movePointRight(2).intValueExact();
        JSONObject gatewayRequest = new JSONObject()
                .put("amount", amount)
                .put("currency", "INR")
                .put("receipt", "sub-" + UUID.randomUUID());
        com.razorpay.Order gatewayOrder = new RazorpayClient(keyId, keySecret).orders.create(gatewayRequest);

        StoreSubscription subscription = new StoreSubscription();
        subscription.setStore(store);
        subscription.setPlan(plan);
        subscription.setStatus("PENDING");
        subscription.setAmountPaid(plan.getPrice());
        subscription.setRazorpayOrderId(gatewayOrder.get("id"));
        StoreSubscription saved = subscriptionRepository.save(subscription);
        return new SubscriptionCheckoutDTO(saved.getId(), gatewayOrder.get("id"), amount, "INR", keyId);
    }

    @Transactional
    public StoreSubscription activateFreePlan(Store store, Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .filter(item -> "Active".equalsIgnoreCase(item.getStatus()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active plan not found"));
        if (plan.getPrice() == null || plan.getPrice() != 0.0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This plan requires payment");
        }

        subscriptionRepository.findByStoreIdAndStatus(store.getId(), "ACTIVE")
                .forEach(active -> active.setStatus("EXPIRED"));

        StoreSubscription subscription = new StoreSubscription();
        subscription.setStore(store);
        subscription.setPlan(plan);
        subscription.setStatus("ACTIVE");
        subscription.setAmountPaid(0.0);
        subscription.setStartedAt(LocalDateTime.now());
        subscription.setExpiresAt(null);
        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public StoreSubscription verify(Store store, SubscriptionVerificationRequest request) throws Exception {
        requireCredentials();
        StoreSubscription subscription = subscriptionRepository.findById(request.subscriptionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription checkout not found"));
        if (!subscription.getStore().getId().equals(store.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Subscription checkout belongs to another store");
        }
        if (!subscription.getRazorpayOrderId().equals(request.razorpayOrderId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Razorpay order reference does not match");
        }
        if ("ACTIVE".equals(subscription.getStatus()) &&
                request.razorpayPaymentId().equals(subscription.getRazorpayPaymentId())) {
            return subscription;
        }

        String signedPayload = request.razorpayOrderId() + "|" + request.razorpayPaymentId();
        if (!Utils.verifySignature(signedPayload, request.razorpaySignature(), keySecret)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Razorpay signature is invalid");
        }
        com.razorpay.Payment payment = new RazorpayClient(keyId, keySecret)
                .payments.fetch(request.razorpayPaymentId());
        int expectedAmount = BigDecimal.valueOf(subscription.getAmountPaid()).movePointRight(2).intValueExact();
        int capturedAmount = new BigDecimal(String.valueOf(payment.get("amount"))).intValueExact();
        if (!request.razorpayOrderId().equals(payment.get("order_id")) ||
                !"captured".equals(payment.get("status")) ||
                !"INR".equals(payment.get("currency")) || expectedAmount != capturedAmount) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Razorpay has not confirmed the plan payment");
        }

        LocalDateTime now = LocalDateTime.now();
        subscriptionRepository.findByStoreIdAndStatus(store.getId(), "ACTIVE")
                .forEach(active -> active.setStatus("EXPIRED"));
        subscription.setRazorpayPaymentId(request.razorpayPaymentId());
        subscription.setStatus("ACTIVE");
        subscription.setStartedAt(now);
        String cycle = subscription.getPlan().getBillingCycle();
        subscription.setExpiresAt("YEARLY".equalsIgnoreCase(cycle) ? now.plusYears(1) : now.plusMonths(1));
        return subscriptionRepository.save(subscription);
    }

    private void requireCredentials() {
        if (keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Subscription checkout is unavailable. Configure Razorpay API credentials."
            );
        }
    }
}