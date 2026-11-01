package com.cartify.controller;

import com.cartify.domain.UserRole;
import com.cartify.modal.Store;
import com.cartify.modal.StoreSubscription;
import com.cartify.modal.SubscriptionPlan;
import com.cartify.modal.User;
import com.cartify.payload.dto.StoreSubscriptionDTO;
import com.cartify.repository.StoreSubscriptionRepository;
import com.cartify.service.StoreSubscriptionPaymentService;
import com.cartify.service.StoreService;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/store-subscriptions")
@RequiredArgsConstructor
public class StoreSubscriptionController {

    private final UserService userService;
    private final StoreService storeService;
    private final StoreSubscriptionRepository subscriptionRepository;
    private final StoreSubscriptionPaymentService paymentService;

    @GetMapping("/current")
    public StoreSubscriptionDTO getCurrent() throws Exception {
        Store store = getOwnedStore();
        return subscriptionRepository.findFirstByStoreIdAndStatusOrderByCreatedAtDesc(store.getId(), "ACTIVE")
                .map(this::toDto)
                .orElse(null);
    }

    @PostMapping("/checkout/{planId}")
    public Object createCheckout(@PathVariable Long planId) throws Exception {
        return paymentService.createCheckout(getOwnedStore(), planId);
    }

    @PostMapping("/activate-free/{planId}")
    public StoreSubscriptionDTO activateFreePlan(@PathVariable Long planId) throws Exception {
        return toDto(paymentService.activateFreePlan(getOwnedStore(), planId));
    }

    @PostMapping("/verify")
    public StoreSubscriptionDTO verify(@RequestBody com.cartify.payload.dto.SubscriptionVerificationRequest request)
            throws Exception {
        return toDto(paymentService.verify(getOwnedStore(), request));
    }

    private Store getOwnedStore() throws Exception {
        User user = userService.getCurrentUser();
        if (user.getRole() != UserRole.ROLE_STORE_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Store administrator access required");
        }
        return storeService.getStoreByAdmin();
    }

    private StoreSubscriptionDTO toDto(StoreSubscription subscription) {
        return new StoreSubscriptionDTO(
                subscription.getId(), subscription.getStatus(), subscription.getAmountPaid(),
                subscription.getStartedAt(), subscription.getExpiresAt(), subscription.getPlan()
        );
    }
}