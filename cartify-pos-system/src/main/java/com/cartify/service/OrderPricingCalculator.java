package com.cartify.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class OrderPricingCalculator {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");

    private OrderPricingCalculator() {
    }

    public static PriceBreakdown calculate(
            BigDecimal subtotal,
            String discountType,
            Double requestedDiscount
    ) {
        BigDecimal roundedSubtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
        BigDecimal tax = roundedSubtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal discountValue = requestedDiscount == null
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(requestedDiscount);

        if (discountValue.signum() < 0) {
            throw new IllegalArgumentException("Discount cannot be negative");
        }

        BigDecimal discount;
        if (discountType == null || discountType.equalsIgnoreCase("percentage")) {
            if (discountValue.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new IllegalArgumentException("Percentage discount cannot exceed 100%");
            }
            discount = roundedSubtotal.multiply(discountValue)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if (discountType.equalsIgnoreCase("fixed")) {
            discount = discountValue.setScale(2, RoundingMode.HALF_UP);
        } else {
            throw new IllegalArgumentException("Unsupported discount type");
        }

        BigDecimal total = roundedSubtotal.add(tax).subtract(discount)
                .setScale(2, RoundingMode.HALF_UP);
        if (total.signum() <= 0) {
            throw new IllegalArgumentException("Order total must be greater than zero");
        }

        return new PriceBreakdown(
                roundedSubtotal.doubleValue(),
                tax.doubleValue(),
                discount.doubleValue(),
                total.doubleValue()
        );
    }

    public record PriceBreakdown(
            double subtotal,
            double taxAmount,
            double discountAmount,
            double totalAmount
    ) {
    }
}