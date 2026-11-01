package com.cartify.controller;

import com.cartify.domain.UserRole;
import com.cartify.modal.User;
import com.cartify.payload.dto.StoreRegistrationDTO;
import com.cartify.payload.dto.StoreStatusCountDTO;
import com.cartify.payload.dto.SuperAdminDashboardOverviewDTO;
import com.cartify.service.SuperAdminDashboard;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/dashboard")
@RequiredArgsConstructor
public class SuperAdminDashboardController {

    private final SuperAdminDashboard dashboardService;
    private final UserService userService;

    @GetMapping("/overview")
    public SuperAdminDashboardOverviewDTO getOverview() throws Exception {
        requireAdmin();
        return dashboardService.getOverview();
    }

    @GetMapping("/registrations")
    public List<StoreRegistrationDTO> getRegistrations(
            @RequestParam(defaultValue = "7") int days
    ) throws Exception {
        requireAdmin();
        return dashboardService.getRegistrations(days);
    }

    @GetMapping("/store-status")
    public List<StoreStatusCountDTO> getStoreStatus() throws Exception {
        requireAdmin();
        return dashboardService.getStatusDistribution();
    }

    private void requireAdmin() throws Exception {
        User user = userService.getCurrentUser();
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Super-admin access required");
        }
    }
}