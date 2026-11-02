package com.cartify.controller;

import com.cartify.exception.UserException;
import com.cartify.domain.UserRole;
import com.cartify.mapper.UserMapper;
import com.cartify.modal.User;
import com.cartify.payload.dto.UserDto;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/users/profile")
    public ResponseEntity<UserDto> getUserProfile(
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @GetMapping("/api/users/{id}")
    public ResponseEntity<UserDto> getUserById(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id
    ) throws UserException, Exception {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @GetMapping("/users/list")
    public ResponseEntity<List<User>> getUserList()
            throws UserException, Exception {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/api/super-admin/users")
    public ResponseEntity<List<UserDto>> getAllUsersForAdmin(
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        requireAdmin(jwt);
        return ResponseEntity.ok(userService.getAllUsersIncludingInactive()
                .stream().map(UserMapper::toDTO).collect(Collectors.toList()));
    }

    @PutMapping("/api/super-admin/users/{id}/status")
    public ResponseEntity<UserDto> updateUserStatus(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id,
            @RequestParam boolean active
    ) throws UserException {
        requireAdmin(jwt);
        return ResponseEntity.ok(UserMapper.toDTO(userService.updateUserStatus(id, active)));
    }

    @PutMapping("/api/super-admin/users/{id}/role")
    public ResponseEntity<UserDto> updateUserRole(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id,
            @RequestParam UserRole role
    ) throws UserException {
        requireAdmin(jwt);
        return ResponseEntity.ok(UserMapper.toDTO(userService.updateUserRole(id, role)));
    }

    private void requireAdmin(String jwt) throws UserException {
        if (userService.getUserFromJwtToken(jwt).getRole() != UserRole.ROLE_ADMIN) {
            throw new UserException("Super-admin access required");
        }
    }

}