package com.cartify.mapper;

import com.cartify.modal.Order;
import com.cartify.payload.dto.OrderDTO;
import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .taxAmount(order.getTaxAmount())
                .discountAmount(order.getDiscountAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .branchId(
                        order.getBranch() != null
                                ? order.getBranch().getId()
                                : null
                )
                .customerId(
                        order.getCustomer() != null
                                ? order.getCustomer().getId()
                                : null
                )
                .cashier(
                        order.getCashier() != null
                                ? UserMapper.toDTO(order.getCashier())
                                : null
                )
                .customer(order.getCustomer())
                .paymentType(order.getPaymentType())
                .items(
                        order.getItems() == null
                                ? List.of()
                                : order.getItems()
                                  .stream()
                                  .map(OrderItemMapper::toDTO)
                                  .collect(Collectors.toList())
                )
                .build();
    }
}
