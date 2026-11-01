package com.cartify.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentSalesDTO {
    private List<RecentOrderDTO> recentOrders;
    private Double todaysRevenue;
    private Long todaysTransactions;
}