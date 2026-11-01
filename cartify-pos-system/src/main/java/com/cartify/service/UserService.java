package com.cartify.service;

import com.cartify.exception.UserException;
import com.cartify.modal.User;

import java.util.List;

public interface UserService {

    User getUserFromJwtToken(String token) throws UserException;
    User getCurrentUser() throws UserException;
    User getUserByEmail(String email) throws UserException;
    User getUserById(Long id) throws UserException, Exception;
    List<User> getAllUsers();
    void deactivateUser(Long id) throws UserException;

}
