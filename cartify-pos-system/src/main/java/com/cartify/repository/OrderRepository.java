package com.cartify.repository;

import com.cartify.modal.Order;
import com.cartify.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order>findByCustomerId(Long customerId);
    List<Order>findByBranchId(Long branchId);
        List<Order> findByBranch_Store_Id(Long storeId);
    List<Order>findByCashierId(Long cashierId);
    List<Order>findByBranchIdAndCreatedAtBetween(Long branchId,
                                                 LocalDateTime from, LocalDateTime to);

    List<Order>findByCashierAndCreatedAtBetween(
            User cashier, LocalDateTime from, LocalDateTime To
    );
    List<Order> findTop5ByBranchIdOrderByCreatedAtDesc(Long branchId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.branch.store.id = :storeId")
    Double sumTotalAmountByStoreId(@Param("storeId") Long storeId);

    List<Order> findTop5ByBranch_Store_IdOrderByCreatedAtDesc(Long storeId);

    List<Order> findByBranch_Store_IdAndCreatedAtBetween(
            Long storeId, LocalDateTime start, LocalDateTime end
    );

    @Query(
            "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
                    "WHERE o.branch.store.id = :storeId AND o.createdAt BETWEEN :startOfDay AND :endOfDay"
    )
    Double sumTotalAmountByStoreIdAndDateRange(
            @Param("storeId") Long storeId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query(
            "SELECT COUNT(o) FROM Order o " +
                    "WHERE o.branch.store.id = :storeId AND o.createdAt BETWEEN :startOfDay AND :endOfDay"
    )
    Long countByStoreIdAndDateRange(
            @Param("storeId") Long storeId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}