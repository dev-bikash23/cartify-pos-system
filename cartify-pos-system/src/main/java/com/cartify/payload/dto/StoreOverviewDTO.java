package com.cartify.payload.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class StoreOverviewDTO {

        private Double totalSales;
        private Long totalBranches;
        private Long totalProducts;
        private Long totalEmployees;

}
