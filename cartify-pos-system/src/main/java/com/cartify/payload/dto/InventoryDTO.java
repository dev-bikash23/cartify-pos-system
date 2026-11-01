package com.cartify.payload.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryDTO {

    private Long id;

    private BranchDTO branch;

    private Long branchId;

    private Long productId;

    private ProductDTO product;

    private Integer quantity;

    private LocalDateTime lastUpdated;
}
