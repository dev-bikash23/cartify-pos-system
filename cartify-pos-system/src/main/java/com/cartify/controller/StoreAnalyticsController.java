package com.cartify.controller;

import com.cartify.payload.dto.MonthlySalesDTO;
import com.cartify.payload.dto.RecentSalesDTO;
import com.cartify.payload.dto.StoreOverviewDTO;
import com.cartify.domain.UserRole;
import com.cartify.modal.Store;
import com.cartify.modal.User;
import com.cartify.service.StoreAnalyticsService;
import com.cartify.service.StoreService;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store/analytics")
public class StoreAnalyticsController {

    private final StoreAnalyticsService storeAnalyticsService;
    private final StoreService storeService;
    private final UserService userService;

    @GetMapping("/{storeId}/overview")
    public ResponseEntity<StoreOverviewDTO> getStoreOverview(
            @PathVariable Long storeId
    ) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getStoreOverview(storeId));
    }

    @GetMapping("/{storeId}/recent-sales")
    public ResponseEntity<RecentSalesDTO> getRecentSales(
            @PathVariable Long storeId
    ) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getRecentSales(storeId));
    }

    @GetMapping("/{storeId}/sales/monthly")
    public ResponseEntity<List<MonthlySalesDTO>> getMonthlySales(
            @PathVariable Long storeId
    ) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getMonthlySales(storeId));
    }

    @GetMapping("/{storeId}/alerts")
    public ResponseEntity<List<Map<String, Object>>> getStoreAlerts(
            @PathVariable Long storeId
    ) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getStoreAlerts(storeId));
    }

    @GetMapping("/{storeId}/alerts/sales")
    public ResponseEntity<List<Map<String, Object>>> getStoreAlertSales(
            @PathVariable Long storeId
    ) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getStoreSalesLast7Days(storeId));
    }

    @GetMapping("/{storeId}/sales-trends")
    public ResponseEntity<List<Map<String, Object>>> getSalesTrends(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "month") String period
    ) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getSalesTrends(storeId, period));
    }

    @GetMapping("/{storeId}/sales/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailySales(@PathVariable Long storeId) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getDailySales(storeId));
    }

    @GetMapping("/{storeId}/sales/category")
    public ResponseEntity<List<Map<String, Object>>> getSalesByCategory(@PathVariable Long storeId) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getSalesByCategory(storeId));
    }

    @GetMapping({"/{storeId}/sales/payment-methods", "/{storeId}/payment"})
    public ResponseEntity<List<Map<String, Object>>> getSalesByPaymentMethod(@PathVariable Long storeId) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getSalesByPaymentMethod(storeId));
    }

    @GetMapping({"/{storeId}/sales/branch", "/{storeId}/branch-performance"})
    public ResponseEntity<List<Map<String, Object>>> getSalesByBranch(@PathVariable Long storeId) throws Exception {
        requireStoreAccess(storeId);
        return ResponseEntity.ok(storeAnalyticsService.getSalesByBranch(storeId));
    }

    private void requireStoreAccess(Long requestedStoreId) throws Exception {
        User user = userService.getCurrentUser();
        if (user.getRole() == UserRole.ROLE_ADMIN) return;
        if (user.getRole() != UserRole.ROLE_STORE_ADMIN && user.getRole() != UserRole.ROLE_STORE_MANAGER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Store analytics access required");
        }
        Store store = storeService.getStoreByAdmin();
        if (!store.getId().equals(requestedStoreId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access another store's analytics");
        }
    }
}