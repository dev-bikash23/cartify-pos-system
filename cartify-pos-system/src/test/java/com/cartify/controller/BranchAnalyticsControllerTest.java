package com.cartify.controller;

import com.cartify.domain.OrderStatus;
import com.cartify.modal.*;
import com.cartify.repository.InventoryRepository;
import com.cartify.repository.OrderRepository;
import com.cartify.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BranchAnalyticsController.class)
@AutoConfigureMockMvc(addFilters = false)
class BranchAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderRepository orderRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private InventoryRepository inventoryRepository;

    @Test
    void categorySales_shouldAggregateValuesByCategory() throws Exception {
        Category category = new Category();
        category.setId(7L);
        category.setName("Electronics");

        Product product = new Product();
        product.setId(11L);
        product.setName("Laptop");
        product.setCategory(category);

        OrderItem item = OrderItem.builder()
                .product(product)
                .quantity(2)
                .price(250.0)
                .build();

        Order order = new Order();
        order.setStatus(OrderStatus.COMPLETED);
        order.setTotalAmount(250.0);
        order.setCreatedAt(LocalDateTime.of(2024, 1, 15, 10, 0));
        order.setItems(List.of(item));

        when(orderRepository.findByBranchIdAndCreatedAtBetween(eq(1L), any(), any()))
                .thenReturn(List.of(order));

        mockMvc.perform(get("/api/branch-analytics/category-sales")
                        .param("branchId", "1")
                        .param("date", "2024-01-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("Electronics"))
                .andExpect(jsonPath("$[0].totalSales").value(250.0))
                .andExpect(jsonPath("$[0].quantitySold").value(2));
    }
}
