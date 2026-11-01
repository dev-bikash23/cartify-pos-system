package com.cartify.repository;

import com.cartify.modal.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {

     List<Refund> findByCashierIdAndCreatedAtBetween(
             Long cashierId,
             LocalDateTime from,
             LocalDateTime to
     );

     List<Refund> findByCashierId(Long id);

     List<Refund> findByShiftReport_Id(Long id);

     List<Refund> findByBranchId(Long id);
}
