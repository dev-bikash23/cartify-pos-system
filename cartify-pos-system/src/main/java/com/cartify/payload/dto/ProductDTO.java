package com.cartify.payload.dto;

import com.cartify.modal.Store;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductDTO {

    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String sku;

    private String description;

    private Double mrp;

    private Double sellingPrice;

    private String brand;

    private String image;

    // private Category category;
    private CategoryDTO category;

    private Long categoryId;
    private Long storeId;

    private Integer stock;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
