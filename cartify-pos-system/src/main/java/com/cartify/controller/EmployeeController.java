package com.cartify.controller;

import com.cartify.domain.UserRole;
import com.cartify.modal.User;
import com.cartify.payload.dto.UserDto;
import com.cartify.payload.response.ApiResponse;
import com.cartify.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/store/{storeId}")
    public ResponseEntity<UserDto> createStoreEmployee(
            @PathVariable Long storeId,
            @RequestBody UserDto userDto
    ) throws Exception {
        return ResponseEntity.ok(
                employeeService.createStoreEmployee(userDto, storeId)
        );
    }

    @PostMapping("/branch/{branchId}")
    public ResponseEntity<UserDto> createBranchEmployee(
            @PathVariable Long branchId,
            @RequestBody UserDto userDto
    ) throws Exception {
        return ResponseEntity.ok(
                employeeService.createBranchEmployee(userDto, branchId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateEmployee(
            @PathVariable Long id,
            @RequestBody UserDto userDto
    ) throws Exception {
        return ResponseEntity.ok(
                employeeService.updateEmployee(id, userDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(
            @PathVariable Long id
    ) throws Exception {
        try {
            employeeService.deleteEmployee(id);

            ApiResponse response = new ApiResponse();
            response.setMessage("Employee deactivated successfully");

            return ResponseEntity.ok(response);
        } catch (IllegalStateException exception) {
            ApiResponse response = new ApiResponse();
            response.setMessage(exception.getMessage());

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }
    }

    @GetMapping("/store/{id}")
    public ResponseEntity<List<UserDto>> storeEmployee(
            @PathVariable Long id,
            @RequestParam(required = false) UserRole userRole
    ) throws Exception {
        return ResponseEntity.ok(
                employeeService.findStoreEmployees(id, userRole)
        );
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<List<UserDto>> branchEmployee(
            @PathVariable Long id,
            @RequestParam(required = false) UserRole userRole
    ) throws Exception {
        return ResponseEntity.ok(
                employeeService.findBranchEmployees(id, userRole)
        );
    }
}