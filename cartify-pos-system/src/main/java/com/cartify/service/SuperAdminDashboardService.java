package com.cartify.service;

import com.cartify.domain.StoreStatus;
import com.cartify.modal.Store;
import com.cartify.payload.dto.StoreRegistrationDTO;
import com.cartify.payload.dto.StoreStatusCountDTO;
import com.cartify.payload.dto.SuperAdminDashboardOverviewDTO;
import com.cartify.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SuperAdminDashboardService implements SuperAdminDashboard {

    private final StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public SuperAdminDashboardOverviewDTO getOverview() {
        List<Store> stores = storeRepository.findAll();
        return new SuperAdminDashboardOverviewDTO(
                stores.size(),
                count(stores, StoreStatus.PENDING),
                count(stores, StoreStatus.ACTIVE),
                count(stores, StoreStatus.BLOCKED)
        );
    }

    @Transactional(readOnly = true)
    public List<StoreRegistrationDTO> getRegistrations(int days) {
        int window = Math.max(1, Math.min(days, 90));
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.minusDays(window - 1L).atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();
        List<Store> stores = storeRepository.findAll().stream()
                .filter(store -> store.getCreatedAt() != null)
                .filter(store -> !store.getCreatedAt().isBefore(start) && store.getCreatedAt().isBefore(end))
                .toList();

        return java.util.stream.IntStream.range(0, window)
                .mapToObj(offset -> {
                    LocalDate date = today.minusDays(window - offset - 1L);
                    long count = stores.stream()
                            .filter(store -> store.getCreatedAt().toLocalDate().equals(date))
                            .count();
                    return new StoreRegistrationDTO(
                            date,
                            date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                            count
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StoreStatusCountDTO> getStatusDistribution() {
        List<Store> stores = storeRepository.findAll();
        return java.util.Arrays.stream(StoreStatus.values())
                .map(status -> new StoreStatusCountDTO(status.name(), count(stores, status)))
                .toList();
    }

    private long count(List<Store> stores, StoreStatus status) {
        return stores.stream().filter(store -> store.getStatus() == status).count();
    }
}