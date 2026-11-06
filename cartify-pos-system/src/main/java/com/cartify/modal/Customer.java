package com.cartify.modal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String email;

    private String phone;

    private LocalDateTime createdAt;

    private  LocalDateTime updatedAt;

    @Transient
    private long totalOrders;

    @Transient
    private double totalSpent;

    @Transient
    private long loyalPoints;
}
