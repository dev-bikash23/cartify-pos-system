package com.cartify.configuration;

import com.cartify.modal.SubscriptionPlan;
import com.cartify.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SubscriptionPlanSeeder implements CommandLineRunner {

    private final SubscriptionPlanRepository planRepository;

    @Override
    public void run(String... args) {
                if (planRepository.count() > 0) {
                        planRepository.findAll().stream()
                                        .filter(plan -> "Basic".equalsIgnoreCase(plan.getName()))
                                        .filter(plan -> Double.valueOf(599).equals(plan.getPrice()))
                                        .findFirst()
                                        .ifPresent(plan -> {
                                                plan.setPrice(0.0);
                                                planRepository.save(plan);
                                        });
                        return;
                }

        planRepository.saveAll(List.of(
                                createPlan("Basic", "Free plan for small stores just getting started", 0, "MONTHLY",
                        1, 3, 200, List.of("API Integration"), false, true, false, false, false, false, false),
                createPlan("Pro", "For growing businesses with multiple branches", 2999, "MONTHLY",
                        5, 15, 2000, List.of("API Integration", "Priority Support"), true, true, true, false, true, true, true),
                createPlan("Advance", "For established chains that need full control", 5999, "MONTHLY",
                        20, 50, 10000, List.of("API Integration", "Priority Support", "Dedicated Manager"),
                        true, true, true, true, true, true, true)
        ));
    }

    private SubscriptionPlan createPlan(String name, String description, double price, String cycle,
                                        int branches, int users, int products, List<String> extras,
                                        boolean advancedReports, boolean inventory, boolean integrations,
                                        boolean ecommerce, boolean invoiceBranding, boolean prioritySupport,
                                        boolean multiLocation) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(name);
        plan.setDescription(description);
        plan.setPrice(price);
        plan.setBillingCycle(cycle);
        plan.setMaxBranches(branches);
        plan.setMaxUsers(users);
        plan.setMaxProducts(products);
        plan.setExtraFeatures(extras);
        plan.setEnableAdvancedReport(advancedReports);
        plan.setEnableInventory(inventory);
        plan.setEnableIntegrations(integrations);
        plan.setEnableEcommerce(ecommerce);
        plan.setEnableInvoiceBranding(invoiceBranding);
        plan.setPrioritySupport(prioritySupport);
        plan.setEnableMultiLocation(multiLocation);
        plan.setStatus("Active");
        return plan;
    }
}