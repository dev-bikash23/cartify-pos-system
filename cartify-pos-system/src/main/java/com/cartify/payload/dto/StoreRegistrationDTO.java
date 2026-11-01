package com.cartify.payload.dto;

import java.time.LocalDate;

public record StoreRegistrationDTO(LocalDate date, String day, long count) {
}