package com.cartify.mapper;

import com.cartify.modal.Order;
import com.cartify.modal.Product;
import com.cartify.modal.Refund;
import com.cartify.modal.ShiftReport;
import com.cartify.payload.dto.OrderDTO;
import com.cartify.payload.dto.ProductDTO;
import com.cartify.payload.dto.RefundDTO;
import com.cartify.payload.dto.ShiftReportDTO;

import java.util.List;
import java.util.stream.Collectors;

public class ShiftReportMapper {

    public static ShiftReportDTO toDTO(ShiftReport entity) {
        return ShiftReportDTO.builder()
                .id(entity.getId())
                .shiftEnd(entity.getShiftEnd())
                .shiftStart(entity.getShiftStart())
                .totalSales(entity.getTotalSales())
                .totalOrders(entity.getTotalOrders())
                .totalRefunds(entity.getTotalRefunds())
                .netSales(entity.getNetSales())
                .cashier(UserMapper.toDTO(entity.getCashier()))
                .cashierId(entity.getCashier().getId())
                .branchId(entity.getBranch().getId())
                .recentOrders(mapOrders(entity.getRecentOrders()))
                .toSellingProducts(mapProducts(entity.getToSellingProducts()))
                .refunds(mapRefunds(entity.getRefunds()))
                .paymentSummaries(entity.getPaymentSummaries())
                .build();
    }

    private static List<RefundDTO> mapRefunds(List<Refund> refunds) {
        if(refunds == null || refunds.isEmpty()) { return  null;}

        return refunds.stream().map(RefundMapper::toDTO).collect(Collectors.toList());
    }

    private static List<ProductDTO> mapProducts(List<Product> toSellingProducts) {
        if(toSellingProducts == null || toSellingProducts.isEmpty()) { return  null;}
        return toSellingProducts.stream().map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    private static List<OrderDTO> mapOrders(List<Order> recentOrders) {
        if(recentOrders == null || recentOrders.isEmpty()) { return null;}
        return recentOrders.stream()
                .map(OrderMapper::toDTO).collect(Collectors.toList());


    }

}
