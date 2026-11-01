package com.cartify.repository;

import com.cartify.modal.StoreSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoreSubscriptionRepository extends JpaRepository<StoreSubscription, Long> {
    Optional<StoreSubscription> findFirstByStoreIdAndStatusOrderByCreatedAtDesc(Long storeId, String status);
    List<StoreSubscription> findByStoreIdAndStatus(Long storeId, String status);
}