package com.cartify.payload.dto;

public record RazorpayCheckoutDTO(
        Long orderId,
        String razorpayOrderId,
        Integer amount,
        String currency,
        String keyId
) {
}