package com.cartify.service;

import com.cartify.domain.StoreStatus;
import com.cartify.modal.Store;
import com.cartify.repository.StoreRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SuperAdminDashboardServiceTest {

    @Test
    void overviewAndStatusDistributionCountPersistedStoreStatuses() {
        StoreRepository repository = mock(StoreRepository.class);
        when(repository.findAll()).thenReturn(List.of(
                store(StoreStatus.ACTIVE), store(StoreStatus.ACTIVE),
                store(StoreStatus.PENDING), store(StoreStatus.BLOCKED)
        ));
        SuperAdminDashboardService service = new SuperAdminDashboardService(repository);

        var overview = service.getOverview();
        var distribution = service.getStatusDistribution();

        assertEquals(4, overview.totalStore());
        assertEquals(2, overview.activeStore());
        assertEquals(1, overview.pendingStore());
        assertEquals(1, overview.blockedStore());
        assertEquals(3, distribution.size());
        assertEquals(2, distribution.get(0).count());
    }

    @Test
    void registrationsClampWindowAndIncludeDaysWithoutRegistrations() {
        StoreRepository repository = mock(StoreRepository.class);
        Store todayStore = store(StoreStatus.PENDING);
        todayStore.setCreatedAt(LocalDateTime.now());
        when(repository.findAll()).thenReturn(List.of(todayStore));
        SuperAdminDashboardService service = new SuperAdminDashboardService(repository);

        var registrations = service.getRegistrations(7);

        assertEquals(7, registrations.size());
        assertEquals(1, registrations.getLast().count());
        assertEquals(0, registrations.getFirst().count());
    }

    private Store store(StoreStatus status) {
        Store store = new Store();
        store.setStatus(status);
        store.setCreatedAt(LocalDateTime.now());
        return store;
    }
}