package com.cartify.repository;

import com.cartify.modal.Store;
import com.cartify.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(TRIM(u.fullName)) = LOWER(TRIM(:fullName))")
    User findFirstByFullNameIgnoreCase(@Param("fullName") String fullName);

    List<User> findByStore(Store store);
    List<User> findByBranchId(Long branchId);
    List<User> findByActiveTrue();

    // Counts users linked to the store either directly (store-level
    // roles like Store Admin/Manager) or through their branch
    // (branch-level roles). Explicit LEFT JOINs are required here —
    // a plain path expression like "u.branch.store.id" in a WHERE
    // clause with OR can implicitly become an INNER JOIN and silently
    // drop users whose branch (or store) is null from the count.
    @Query(
            "SELECT COUNT(DISTINCT u) FROM User u " +
                    "LEFT JOIN u.store s " +
                    "LEFT JOIN u.branch b " +
                    "LEFT JOIN b.store bs " +
                    "WHERE s.id = :storeId OR bs.id = :storeId"
    )
    Long countEmployeesByStoreId(@Param("storeId") Long storeId);
}