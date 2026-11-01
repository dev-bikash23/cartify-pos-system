package com.cartify.modal;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Embeddable
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreContact {

    private String address;

    private String phone;

    @Email(message = "Invalid format")
    private String email;

    private Double latitude;

    private Double longitude;
}
