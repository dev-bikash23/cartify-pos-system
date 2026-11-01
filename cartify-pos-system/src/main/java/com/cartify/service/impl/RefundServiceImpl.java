package com.cartify.service.impl;

import com.cartify.mapper.RefundMapper;
import com.cartify.modal.Branch;
import com.cartify.modal.Order;
import com.cartify.modal.Refund;
import com.cartify.modal.ShiftReport;
import com.cartify.modal.User;
import com.cartify.payload.dto.RefundDTO;
import com.cartify.repository.OrderRepository;
import com.cartify.repository.RefundRepository;
import com.cartify.repository.ShiftReportRepository;
import com.cartify.service.RefundService;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final UserService userService;
    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final ShiftReportRepository shiftReportRepository;

    @Override
    public RefundDTO createRefund(RefundDTO refund) throws Exception {

        User cashier = userService.getCurrentUser();

        Order order = orderRepository.findById(refund.getOrderId())
                .orElseThrow(() -> new Exception("Order not found"));

        Branch branch = order.getBranch();

        ShiftReport shiftReport = null;

        if (refund.getShiftReportId() != null) {
            shiftReport = shiftReportRepository
                    .findById(refund.getShiftReportId())
                    .orElseThrow(() -> new Exception("Shift report not found"));
        }

        Double refundAmount = refund.getAmount() != null
                ? refund.getAmount()
                : order.getTotalAmount();

        Refund createdRefund = Refund.builder()
                .order(order)
                .cashier(cashier)
                .branch(branch)
                .shiftReport(shiftReport)
                .reason(refund.getReason())
                .amount(refundAmount)
                .paymentType(refund.getPaymentType())
                .createdAt(refund.getCreatedAt())
                .build();

        Refund savedRefund = refundRepository.save(createdRefund);

        return RefundMapper.toDTO(savedRefund);
    }

    @Override
    public List<RefundDTO> getAllRefund() throws Exception {
        return refundRepository.findAll()
                .stream()
                .map(RefundMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByCashier(Long cashierId)
            throws Exception {
        return refundRepository.findByCashierId(cashierId)
                .stream()
                .map(RefundMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByShiftReporter(Long shiftReporterId)
            throws Exception {
        return refundRepository.findByShiftReport_Id(shiftReporterId)
                .stream()
                .map(RefundMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByCashierAndDateRange(
            Long cashierId,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        return refundRepository
                .findByCashierIdAndCreatedAtBetween(
                        cashierId,
                        startDate,
                        endDate
                )
                .stream()
                .map(RefundMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByBranch(Long branchId)
            throws Exception {
        return refundRepository.findByBranchId(branchId)
                .stream()
                .map(RefundMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RefundDTO getRefundById(Long refundId)
            throws Exception {
        return refundRepository.findById(refundId)
                .map(RefundMapper::toDTO)
                .orElseThrow(() -> new Exception("Refund not found"));
    }

    @Override
    public void deleteRefund(Long refundId)
            throws Exception {
        getRefundById(refundId);
        refundRepository.deleteById(refundId);
    }
}