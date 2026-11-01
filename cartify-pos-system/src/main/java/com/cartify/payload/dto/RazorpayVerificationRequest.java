package com.cartify.payload.dto;

public record RazorpayVerificationRequest(
        Long orderId,
        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature
) {
}