package com.cartify.controller;

import com.cartify.domain.UserRole;
import com.cartify.modal.SubscriptionPlan;
import com.cartify.modal.User;
import com.cartify.repository.SubscriptionPlanRepository;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanRepository planRepository;
    private final UserService userService;

    @GetMapping("/api/subscription-plans")
    public List<SubscriptionPlan> getAvailablePlans() {
        return planRepository.findByStatusIgnoreCaseOrderByPriceAsc("Active");
    }

    @GetMapping("/api/super-admin/subscription-plan")
    public List<SubscriptionPlan> getAllPlans() throws Exception {
        requireAdmin();
        return planRepository.findAll();
    }

    @PostMapping("/api/super-admin/subscription-plan")
    public ResponseEntity<SubscriptionPlan> createPlan(@RequestBody SubscriptionPlan plan) throws Exception {
        requireAdmin();
        plan.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(planRepository.save(plan));
    }

    @PutMapping("/api/super-admin/subscription-plan/{id}")
    public SubscriptionPlan updatePlan(@PathVariable Long id, @RequestBody SubscriptionPlan input) throws Exception {
        requireAdmin();
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));
        plan.setName(input.getName());
        plan.setDescription(input.getDescription());
        plan.setPrice(input.getPrice());
        plan.setBillingCycle(input.getBillingCycle());
        plan.setMaxBranches(input.getMaxBranches());
        plan.setMaxUsers(input.getMaxUsers());
        plan.setMaxProducts(input.getMaxProducts());
        plan.setEnableAdvancedReport(input.isEnableAdvancedReport());
        plan.setEnableInventory(input.isEnableInventory());
        plan.setEnableIntegrations(input.isEnableIntegrations());
        plan.setEnableEcommerce(input.isEnableEcommerce());
        plan.setEnableInvoiceBranding(input.isEnableInvoiceBranding());
        plan.setPrioritySupport(input.isPrioritySupport());
        plan.setEnableMultiLocation(input.isEnableMultiLocation());
        plan.setExtraFeatures(input.getExtraFeatures());
        plan.setStatus(input.getStatus());
        return planRepository.save(plan);
    }

    @DeleteMapping("/api/super-admin/subscription-plan/{id}")
    public ResponseEntity<Void> deactivatePlan(@PathVariable Long id) throws Exception {
        requireAdmin();
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan not found"));
        plan.setStatus("Inactive");
        planRepository.save(plan);
        return ResponseEntity.noContent().build();
    }

    private void requireAdmin() throws Exception {
        User user = userService.getCurrentUser();
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administrator access required");
        }
    }
}