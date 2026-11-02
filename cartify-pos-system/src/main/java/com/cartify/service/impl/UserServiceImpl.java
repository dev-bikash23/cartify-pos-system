package com.cartify.service.impl;

import com.cartify.configuration.JwtProvider;
import com.cartify.exception.UserException;
import com.cartify.modal.User;
import com.cartify.domain.UserRole;
import com.cartify.repository.UserRepository;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    public User getUserFromJwtToken(String token) throws UserException {
        String email = jwtProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);

        if (user == null || !user.isActive()) {
            throw new UserException("Invalid token or inactive user");
        }

        return user;
    }

    @Override
    public User getCurrentUser() throws UserException {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email);

        if (user == null || !user.isActive()) {
            throw new UserException("User not found or inactive");
        }

        return user;
    }

    @Override
    public User getUserByEmail(String email) throws UserException {
        User user = userRepository.findByEmail(email);

        if (user == null || !user.isActive()) {
            throw new UserException("User not found or inactive");
        }

        return user;
    }

    @Override
    public User getUserById(Long id) throws UserException, Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found"));
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) throws UserException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found"));

        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findByActiveTrue();
    }

    @Override
    public List<User> getAllUsersIncludingInactive() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User updateUserStatus(Long id, boolean active) throws UserException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found"));
        user.setActive(active);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUserRole(Long id, UserRole role) throws UserException {
        if (role == null) {
            throw new UserException("Role is required");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }
}