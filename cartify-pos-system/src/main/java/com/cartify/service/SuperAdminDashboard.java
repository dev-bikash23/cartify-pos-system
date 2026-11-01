package com.cartify.service;

import com.cartify.payload.dto.StoreRegistrationDTO;
import com.cartify.payload.dto.StoreStatusCountDTO;
import com.cartify.payload.dto.SuperAdminDashboardOverviewDTO;

import java.util.List;

public interface SuperAdminDashboard {
    SuperAdminDashboardOverviewDTO getOverview();
    List<StoreRegistrationDTO> getRegistrations(int days);
    List<StoreStatusCountDTO> getStatusDistribution();
}