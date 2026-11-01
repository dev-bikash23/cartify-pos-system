package com.cartify.service;

import com.cartify.payload.dto.RefundDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface RefundService {

    RefundDTO createRefund(RefundDTO refund) throws Exception;
    List<RefundDTO> getAllRefund() throws Exception;
    List<RefundDTO> getRefundByCashier(Long cashierId) throws Exception;
    List<RefundDTO> getRefundByShiftReporter(Long shiftReporterId) throws Exception;
    List<RefundDTO> getRefundByCashierAndDateRange(Long cashierId, LocalDateTime startDate,
                                                   LocalDateTime endDate);

    List<RefundDTO> getRefundByBranch(Long branchId) throws Exception;

    RefundDTO getRefundById(Long refundId) throws Exception;

    void deleteRefund(Long refundId) throws Exception;

}
