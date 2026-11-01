package com.cartify.controller;

import com.cartify.domain.UserRole;
import com.cartify.modal.User;
import com.cartify.service.StoreAnalyticsService;
import com.cartify.service.StoreService;
import com.cartify.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StoreAnalyticsController.class)
@AutoConfigureMockMvc(addFilters = false)
class StoreAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StoreAnalyticsService analyticsService;

    @MockBean
    private StoreService storeService;

    @MockBean
    private UserService userService;

    @BeforeEach
    void authenticateAsSuperAdmin() throws Exception {
        User admin = new User();
        admin.setRole(UserRole.ROLE_ADMIN);
        when(userService.getCurrentUser()).thenReturn(admin);
    }

    @Test
    void missingStoreAnalyticsRoutesReturnAggregatedData() throws Exception {
        when(analyticsService.getDailySales(9L)).thenReturn(List.of(Map.of("date", "2026-10-02", "sales", 125.0)));
        when(analyticsService.getSalesByCategory(9L)).thenReturn(List.of(Map.of("categoryName", "Food", "totalSales", 125.0)));
        when(analyticsService.getSalesByPaymentMethod(9L)).thenReturn(List.of(Map.of("type", "UPI", "totalAmount", 125.0)));
        when(analyticsService.getSalesByBranch(9L)).thenReturn(List.of(Map.of("branchName", "Central", "totalSales", 125.0)));
        when(analyticsService.getSalesTrends(9L, "week")).thenReturn(List.of(Map.of("label", "Fri", "sales", 125.0)));

        mockMvc.perform(get("/api/store/analytics/9/sales/daily"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].sales").value(125.0));
        mockMvc.perform(get("/api/store/analytics/9/sales/category"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].categoryName").value("Food"));
        mockMvc.perform(get("/api/store/analytics/9/sales/payment-methods"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].type").value("UPI"));
        mockMvc.perform(get("/api/store/analytics/9/sales/branch"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].branchName").value("Central"));
        mockMvc.perform(get("/api/store/analytics/9/sales-trends").param("period", "week"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].label").value("Fri"));
    }
}