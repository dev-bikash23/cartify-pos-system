package com.cartify.modal;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
@NoArgsConstructor
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String billingCycle;

    private Integer maxBranches;
    private Integer maxUsers;
    private Integer maxProducts;

    private boolean enableAdvancedReport;
    private boolean enableInventory;
    private boolean enableIntegrations;
    private boolean enableEcommerce;
    private boolean enableInvoiceBranding;
    private boolean prioritySupport;
    private boolean enableMultiLocation;

    @Column(nullable = false)
    private String status = "Active";

    @ElementCollection
    @CollectionTable(name = "subscription_plan_extra_features", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "feature")
    private List<String> extraFeatures = new ArrayList<>();
}