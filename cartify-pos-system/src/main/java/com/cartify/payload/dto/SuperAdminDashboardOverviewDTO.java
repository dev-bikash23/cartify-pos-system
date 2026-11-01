package com.cartify.payload.dto;

public record SuperAdminDashboardOverviewDTO(
        long totalStore,
        long pendingStore,
        long activeStore,
        long blockedStore
) {
}