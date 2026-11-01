package com.cartify.mapper;

import com.cartify.modal.Category;
import com.cartify.payload.dto.CategoryDTO;

public class CategoryMapper {

    public static CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .storeId(category.getStore()!=null?category.getStore().getId():null)
                .build();

    }
}
