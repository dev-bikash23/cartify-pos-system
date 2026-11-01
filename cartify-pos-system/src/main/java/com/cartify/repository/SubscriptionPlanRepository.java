package com.cartify.repository;

import com.cartify.modal.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    List<SubscriptionPlan> findByStatusIgnoreCaseOrderByPriceAsc(String status);
}