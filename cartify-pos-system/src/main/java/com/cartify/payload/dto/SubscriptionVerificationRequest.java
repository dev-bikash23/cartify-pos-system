package com.cartify.payload.dto;

public record SubscriptionVerificationRequest(
        Long subscriptionId,
        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature
) {
}