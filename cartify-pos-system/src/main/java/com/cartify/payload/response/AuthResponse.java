package com.cartify.payload.response;

import com.cartify.payload.dto.UserDto;
import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private UserDto userDto;

}
