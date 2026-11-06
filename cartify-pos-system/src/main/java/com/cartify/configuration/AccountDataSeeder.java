package com.cartify.configuration;

import com.cartify.domain.StoreStatus;
import com.cartify.domain.UserRole;
import com.cartify.modal.Branch;
import com.cartify.modal.Store;
import com.cartify.modal.User;
import com.cartify.repository.BranchRepository;
import com.cartify.repository.StoreRepository;
import com.cartify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
public class AccountDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking initial accounts...");

        // 1. Super Admin: ramakrishna@gmail.com / 123456789
        if (userRepository.findByEmail("ramakrishna@gmail.com") == null) {
            User superAdmin = new User();
            superAdmin.setFullName("Ramakrishna");
            superAdmin.setEmail("ramakrishna@gmail.com");
            superAdmin.setPassword(passwordEncoder.encode("123456789"));
            superAdmin.setRole(UserRole.ROLE_ADMIN);
            superAdmin.setActive(true);
            superAdmin.setCreatedAt(LocalDateTime.now());
            userRepository.save(superAdmin);
            log.info("Super Admin account seeded: ramakrishna@gmail.com");
        }

        // 2. Store Admin: raju@gmail.com / 12345678
        User storeAdmin = userRepository.findByEmail("raju@gmail.com");
        Store store;
        if (storeAdmin == null) {
            storeAdmin = new User();
            storeAdmin.setFullName("Raju");
            storeAdmin.setEmail("raju@gmail.com");
            storeAdmin.setPassword(passwordEncoder.encode("12345678"));
            storeAdmin.setRole(UserRole.ROLE_STORE_ADMIN);
            storeAdmin.setBusinessName("Cartify Retail");
            storeAdmin.setBusinessType("Retail Store");
            storeAdmin.setBusinessAddress("Main City Center");
            storeAdmin.setActive(true);
            storeAdmin.setCreatedAt(LocalDateTime.now());
            storeAdmin = userRepository.save(storeAdmin);

            store = new Store();
            store.setBrand("Cartify Retail");
            store.setStoreType("Retail Store");
            store.setDescription("Main City Center");
            store.setStatus(StoreStatus.ACTIVE);
            store.setStoreAdmin(storeAdmin);
            store.setCreatedAt(LocalDateTime.now());
            store = storeRepository.save(store);

            storeAdmin.setStore(store);
            userRepository.save(storeAdmin);
            log.info("Store Admin and Store seeded: raju@gmail.com");
        } else {
            store = storeAdmin.getStore();
            if (store == null) {
                store = new Store();
                store.setBrand("Cartify Retail");
                store.setStoreType("Retail Store");
                store.setDescription("Main City Center");
                store.setStatus(StoreStatus.ACTIVE);
                store.setStoreAdmin(storeAdmin);
                store.setCreatedAt(LocalDateTime.now());
                store = storeRepository.save(store);
                storeAdmin.setStore(store);
                userRepository.save(storeAdmin);
            }
        }

        // 3. Branch Manager: aditya@gmail.com / 12345678
        User branchManager = userRepository.findByEmail("aditya@gmail.com");
        Branch branch;
        if (branchManager == null) {
            branchManager = new User();
            branchManager.setFullName("Aditya");
            branchManager.setEmail("aditya@gmail.com");
            branchManager.setPassword(passwordEncoder.encode("12345678"));
            branchManager.setRole(UserRole.ROLE_BRANCH_MANAGER);
            branchManager.setStore(store);
            branchManager.setActive(true);
            branchManager.setCreatedAt(LocalDateTime.now());
            branchManager = userRepository.save(branchManager);

            branch = new Branch();
            branch.setName("Downtown Branch");
            branch.setAddress("1st Main Market Road");
            branch.setEmail("aditya@gmail.com");
            branch.setPhone("9876543210");
            branch.setOpenTime(LocalTime.of(9, 0));
            branch.setCloseTime(LocalTime.of(22, 0));
            branch.setWorkingDays(List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"));
            branch.setStore(store);
            branch.setManager(branchManager);
            branch.setCreatedAt(LocalDateTime.now());
            branch = branchRepository.save(branch);

            branchManager.setBranch(branch);
            userRepository.save(branchManager);
            log.info("Branch Manager and Branch seeded: aditya@gmail.com");
        } else {
            branch = branchManager.getBranch();
            if (branch == null) {
                branch = new Branch();
                branch.setName("Downtown Branch");
                branch.setAddress("1st Main Market Road");
                branch.setEmail("aditya@gmail.com");
                branch.setPhone("9876543210");
                branch.setOpenTime(LocalTime.of(9, 0));
                branch.setCloseTime(LocalTime.of(22, 0));
                branch.setWorkingDays(List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"));
                branch.setStore(store);
                branch.setManager(branchManager);
                branch.setCreatedAt(LocalDateTime.now());
                branch = branchRepository.save(branch);
                branchManager.setBranch(branch);
                userRepository.save(branchManager);
            }
        }

        // 4. Cashier: testcashier@example.com / cashier123
        if (userRepository.findByEmail("testcashier@example.com") == null) {
            User cashier = new User();
            cashier.setFullName("Test Cashier");
            cashier.setEmail("testcashier@example.com");
            cashier.setPassword(passwordEncoder.encode("cashier123"));
            cashier.setRole(UserRole.ROLE_BRANCH_CASHIER);
            cashier.setStore(store);
            cashier.setBranch(branch);
            cashier.setActive(true);
            cashier.setCreatedAt(LocalDateTime.now());
            userRepository.save(cashier);
            log.info("Cashier account seeded: testcashier@example.com");
        }

        log.info("All 4 accounts verified and ready!");
    }
}
