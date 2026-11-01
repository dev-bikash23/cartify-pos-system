package com.cartify.payload.dto;

public record SubscriptionCheckoutDTO(
        Long subscriptionId,
        String razorpayOrderId,
        Integer amount,
        String currency,
        String keyId
) {
}