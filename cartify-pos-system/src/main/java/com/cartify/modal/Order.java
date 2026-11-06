package com.cartify.modal;

import com.cartify.domain.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import com.cartify.domain.OrderStatus;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
@Entity
@Getter
@Setter@NoArgsConstructor
@AllArgsConstructor
@Builder

@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalAmount;

    private Double taxAmount;

    private Double discountAmount;

    private LocalDateTime createdAt;

    @ManyToOne
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cashier_id")
    private User cashier;

    @ManyToOne
    private Customer customer;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;


    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItem> items;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Refund> refunds;

    private PaymentType paymentType;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

    }

    public User getCashier() {
        return cashier;
    }

    public void setCashier(User cashier) {
        this.cashier = cashier;
    }
}
