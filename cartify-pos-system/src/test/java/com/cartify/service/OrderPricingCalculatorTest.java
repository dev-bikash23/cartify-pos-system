package com.cartify.service;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class OrderPricingCalculatorTest {

    @Test
    void calculatesTaxAndPercentageDiscountLikeCashier() {
        OrderPricingCalculator.PriceBreakdown pricing = OrderPricingCalculator.calculate(
                new BigDecimal("5898.00"), "percentage", 80.0
        );

        assertEquals(1061.64, pricing.taxAmount(), 0.001);
        assertEquals(4718.40, pricing.discountAmount(), 0.001);
        assertEquals(2241.24, pricing.totalAmount(), 0.001);
    }

    @Test
    void calculatesFixedDiscount() {
        OrderPricingCalculator.PriceBreakdown pricing = OrderPricingCalculator.calculate(
                new BigDecimal("100.00"), "fixed", 15.0
        );

        assertEquals(18.0, pricing.taxAmount(), 0.001);
        assertEquals(15.0, pricing.discountAmount(), 0.001);
        assertEquals(103.0, pricing.totalAmount(), 0.001);
    }

    @Test
    void rejectsDiscountAboveOneHundredPercent() {
        assertThrows(IllegalArgumentException.class, () ->
                OrderPricingCalculator.calculate(new BigDecimal("100.00"), "percentage", 101.0)
        );
    }
}