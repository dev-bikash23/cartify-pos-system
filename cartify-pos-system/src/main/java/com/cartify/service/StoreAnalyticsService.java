package com.cartify.service;

import com.cartify.payload.dto.MonthlySalesDTO;
import com.cartify.payload.dto.RecentSalesDTO;
import com.cartify.payload.dto.StoreOverviewDTO;

import java.util.List;
import java.util.Map;

public interface StoreAnalyticsService {
    StoreOverviewDTO getStoreOverview(Long storeId) throws Exception;
    RecentSalesDTO getRecentSales(Long storeId) throws Exception;
    List<MonthlySalesDTO> getMonthlySales(Long storeId) throws Exception;
    List<Map<String, Object>> getStoreAlerts(Long storeId) throws Exception;
    List<Map<String, Object>> getStoreSalesLast7Days(Long storeId) throws Exception;
    List<Map<String, Object>> getSalesTrends(Long storeId, String period) throws Exception;
    List<Map<String, Object>> getDailySales(Long storeId) throws Exception;
    List<Map<String, Object>> getSalesByCategory(Long storeId) throws Exception;
    List<Map<String, Object>> getSalesByPaymentMethod(Long storeId) throws Exception;
    List<Map<String, Object>> getSalesByBranch(Long storeId) throws Exception;
    List<Map<String, Object>> getBranchPerformance(Long storeId) throws Exception;
}