package com.cartify.modal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDateTime shiftStart;
    private LocalDateTime shiftEnd;

    private Double totalSales;
    private Double totalRefunds;
    private Double netSales;
    private int totalOrders;

    @ManyToOne
    private User cashier;

    @ManyToOne
    private Branch branch;

    @Transient
    private List<PaymentSummary> paymentSummaries;

    @ManyToMany
    @JoinTable(
            name = "shift_report_selling_products",
            joinColumns = @JoinColumn(name = "shift_report_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> toSellingProducts;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Order> recentOrders;

    @OneToMany(mappedBy = "shiftReport", cascade = CascadeType.ALL)
   private List<Refund> refunds;



}
