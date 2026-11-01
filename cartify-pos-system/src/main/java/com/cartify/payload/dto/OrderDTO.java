package com.cartify.payload.dto;

import com.cartify.domain.PaymentType;
import com.cartify.modal.Customer;

import lombok.Builder;
import lombok.Data;
import com.cartify.domain.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {

    private Long id;

    private Double totalAmount;

    private Double taxAmount;

    private Double discountAmount;

    private String discountType;

    private Double discountValue;

    private OrderStatus status;
    private LocalDateTime createdAt;

    private Long branchId;

    private Long customerId;

    private BranchDTO branch;


    private UserDto cashier;

    private Customer customer;

    private PaymentType paymentType;

    private List<OrderItemDTO> items;
}
