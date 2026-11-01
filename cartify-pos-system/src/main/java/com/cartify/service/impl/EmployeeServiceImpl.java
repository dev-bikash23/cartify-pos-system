package com.cartify.service.impl;

import com.cartify.domain.UserRole;
import com.cartify.mapper.UserMapper;
import com.cartify.modal.Branch;
import com.cartify.modal.Store;
import com.cartify.modal.User;
import com.cartify.payload.dto.UserDto;
import com.cartify.repository.BranchRepository;
import com.cartify.repository.StoreRepository;
import com.cartify.repository.UserRepository;
import com.cartify.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto createStoreEmployee(
            UserDto employee,
            Long storeId
    ) throws Exception {

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new Exception("Store not found"));

        Branch branch = null;

        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER) {
            if (employee.getBranchId() == null) {
                throw new Exception("Branch ID is required");
            }

            branch = branchRepository.findById(employee.getBranchId())
                    .orElseThrow(() -> new Exception("Branch not found"));
        }

        User user = UserMapper.toEntity(employee);
        user.setStore(store);
        user.setBranch(branch);
        user.setActive(true);
        user.setPassword(
                passwordEncoder.encode(employee.getPassword())
        );

        User savedEmployee = userRepository.save(user);

        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER
                && branch != null) {
            branch.setManager(savedEmployee);
            branchRepository.save(branch);
        }

        return UserMapper.toDTO(savedEmployee);
    }

    @Override
    public UserDto createBranchEmployee(
            UserDto employee,
            Long branchId
    ) throws Exception {

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new Exception("Branch not found"));

        if (employee.getRole() != UserRole.ROLE_BRANCH_CASHIER
                && employee.getRole() != UserRole.ROLE_BRANCH_MANAGER
                && employee.getRole() != UserRole.ROLE_BRANCH_ADMIN) {
            throw new Exception("Branch role not supported");
        }

        User user = UserMapper.toEntity(employee);
        user.setBranch(branch);
        user.setActive(true);
        user.setPassword(
                passwordEncoder.encode(employee.getPassword())
        );

        User savedEmployee = userRepository.save(user);

        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER) {
            branch.setManager(savedEmployee);
            branchRepository.save(branch);
        }

        return UserMapper.toDTO(savedEmployee);
    }

    @Override
    public User updateEmployee(
            Long employeeId,
            UserDto employeeDetails
    ) throws Exception {

        User existingEmployee = userRepository.findById(employeeId)
                .orElseThrow(
                        () -> new Exception("Employee does not exist")
                );

        if (employeeDetails.getBranchId() != null) {
            Branch branch = branchRepository
                    .findById(employeeDetails.getBranchId())
                    .orElseThrow(
                            () -> new Exception("Branch not found")
                    );

            existingEmployee.setBranch(branch);
        }

        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setFullName(employeeDetails.getFullName());
        existingEmployee.setPhone(employeeDetails.getPhone());
        existingEmployee.setRole(employeeDetails.getRole());

        if (employeeDetails.getPassword() != null
                && !employeeDetails.getPassword().isBlank()) {
            existingEmployee.setPassword(
                    passwordEncoder.encode(employeeDetails.getPassword())
            );
        }

        return userRepository.save(existingEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long employeeId) throws Exception {

        User employee = userRepository.findById(employeeId)
                .orElseThrow(
                        () -> new Exception("Employee not found")
                );

        if (branchRepository.existsByManagerId(employeeId)) {
            throw new IllegalStateException(
                    "Cannot delete this employee because they are currently "
                            + "assigned as a branch manager. Please reassign "
                            + "the branch manager before deleting this employee."
            );
        }

        // Soft delete: keep the user because shift reports reference this user.
        employee.setActive(false);
        userRepository.save(employee);
    }

    @Override
    public List<UserDto> findStoreEmployees(
            Long storeId,
            UserRole role
    ) throws Exception {

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new Exception("Store not found"));

        return userRepository.findByStore(store)
                .stream()
                .filter(User::isActive)
                .filter(user -> role == null || user.getRole() == role)
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> findBranchEmployees(
            Long branchId,
            UserRole role
    ) throws Exception {

        branchRepository.findById(branchId)
                .orElseThrow(() -> new Exception("Branch not found"));

        return userRepository.findByBranchId(branchId)
                .stream()
                .filter(User::isActive)
                .filter(user -> role == null || user.getRole() == role)
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }
}