package com.cartify.modal;

import com.cartify.domain.PaymentType;
import lombok.*;

@Data
public class PaymentSummary {

    private PaymentType type;
    private Double totalAmount;
    private int transactionCount;
    private double percentage;

}
