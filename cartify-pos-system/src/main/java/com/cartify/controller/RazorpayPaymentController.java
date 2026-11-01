package com.cartify.controller;

import com.cartify.payload.dto.OrderDTO;
import com.cartify.payload.dto.RazorpayCheckoutDTO;
import com.cartify.payload.dto.RazorpayVerificationRequest;
import com.cartify.service.impl.RazorpayPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments/razorpay")
@RequiredArgsConstructor
public class RazorpayPaymentController {

    private final RazorpayPaymentService razorpayPaymentService;

    @PostMapping("/orders")
    public ResponseEntity<RazorpayCheckoutDTO> createCheckoutOrder(
            @RequestBody OrderDTO order
    ) throws Exception {
        return ResponseEntity.ok(razorpayPaymentService.createCheckoutOrder(order));
    }

    @PostMapping("/verify")
    public ResponseEntity<OrderDTO> verifyPayment(
            @RequestBody RazorpayVerificationRequest request
    ) throws Exception {
        return ResponseEntity.ok(razorpayPaymentService.verifyPayment(request));
    }
}