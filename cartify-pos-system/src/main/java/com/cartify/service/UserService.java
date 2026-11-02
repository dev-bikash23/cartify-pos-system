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
    List<User> getAllUsersIncludingInactive();
    User updateUserStatus(Long id, boolean active) throws UserException;
    User updateUserRole(Long id, com.cartify.domain.UserRole role) throws UserException;
    void deactivateUser(Long id) throws UserException;

}
