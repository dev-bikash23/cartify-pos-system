package com.cartify.mapper;

import com.cartify.modal.Refund;
import com.cartify.payload.dto.RefundDTO;

public class RefundMapper {

    private RefundMapper() {
    }

    public static RefundDTO toDTO(Refund refund) {

        return RefundDTO.builder()
                .id(refund.getId())
                .orderId(
                        refund.getOrder() != null
                                ? refund.getOrder().getId()
                                : null
                )
                .reason(refund.getReason())
                .amount(refund.getAmount())
                .cashierName(
                        refund.getCashier() != null
                                ? refund.getCashier().getFullName()
                                : null
                )
                .branchId(
                        refund.getBranch() != null
                                ? refund.getBranch().getId()
                                : null
                )
                .shiftReportId(
                        refund.getShiftReport() != null
                                ? refund.getShiftReport().getId()
                                : null
                )
                .paymentType(refund.getPaymentType())
                .createdAt(refund.getCreatedAt())
                .build();
    }
}
