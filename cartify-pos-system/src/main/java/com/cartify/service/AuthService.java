package com.cartify.service;

import com.cartify.exception.UserException;
import com.cartify.payload.dto.UserDto;
import com.cartify.payload.response.AuthResponse;

public interface AuthService {


    AuthResponse signup(UserDto userDto) throws UserException;

    AuthResponse login(UserDto userDto) throws UserException;

    UserDto updateUser(Long id, UserDto userDto) throws UserException;

}
