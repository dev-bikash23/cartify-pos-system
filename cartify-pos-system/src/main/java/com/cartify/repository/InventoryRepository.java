package com.cartify.repository;

import com.cartify.modal.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByProductIdAndBranchId(Long productId, Long branchId);
    List<Inventory> findByBranchId(Long branchId);

    List<Inventory> findByProduct_Store_Id(Long storeId);

    Inventory findFirstByProductIdAndBranchId(Long productId, Long branchId);
}
