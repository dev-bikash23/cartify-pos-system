package com.cartify.controller;

import com.cartify.domain.UserRole;
import com.cartify.payload.dto.StoreRegistrationDTO;
import com.cartify.payload.dto.StoreStatusCountDTO;
import com.cartify.payload.dto.SuperAdminDashboardOverviewDTO;
import com.cartify.modal.User;
import com.cartify.service.SuperAdminDashboard;
import com.cartify.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SuperAdminDashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class SuperAdminDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
        private SuperAdminDashboard dashboardService;

    @MockBean
    private UserService userService;

    @BeforeEach
    void authenticateAsSuperAdmin() throws Exception {
        User admin = new User();
        admin.setRole(UserRole.ROLE_ADMIN);
        when(userService.getCurrentUser()).thenReturn(admin);
    }

    @Test
    void overviewReturnsStoreStatusKpis() throws Exception {
        when(dashboardService.getOverview())
                .thenReturn(new SuperAdminDashboardOverviewDTO(12, 3, 7, 2));

        mockMvc.perform(get("/api/super-admin/dashboard/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalStore").value(12))
                .andExpect(jsonPath("$.pendingStore").value(3))
                .andExpect(jsonPath("$.activeStore").value(7))
                .andExpect(jsonPath("$.blockedStore").value(2));
    }

    @Test
    void registrationsReturnsDailyStoreCounts() throws Exception {
        when(dashboardService.getRegistrations(7))
                .thenReturn(List.of(new StoreRegistrationDTO(LocalDate.of(2026, 10, 2), "Fri", 2)));

        mockMvc.perform(get("/api/super-admin/dashboard/registrations").param("days", "7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].date").value("2026-10-02"))
                .andExpect(jsonPath("$[0].day").value("Fri"))
                .andExpect(jsonPath("$[0].count").value(2));
    }

    @Test
    void storeStatusReturnsAllStatuses() throws Exception {
        when(dashboardService.getStatusDistribution()).thenReturn(List.of(
                new StoreStatusCountDTO("ACTIVE", 4),
                new StoreStatusCountDTO("PENDING", 2),
                new StoreStatusCountDTO("BLOCKED", 1)
        ));

        mockMvc.perform(get("/api/super-admin/dashboard/store-status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[0].count").value(4))
                .andExpect(jsonPath("$[2].status").value("BLOCKED"));
    }
}