package com.cartify.payload.dto;

import com.cartify.modal.SubscriptionPlan;

import java.time.LocalDateTime;

public record StoreSubscriptionDTO(
        Long id,
        String status,
        Double amountPaid,
        LocalDateTime startedAt,
        LocalDateTime expiresAt,
        SubscriptionPlan plan
) {
}