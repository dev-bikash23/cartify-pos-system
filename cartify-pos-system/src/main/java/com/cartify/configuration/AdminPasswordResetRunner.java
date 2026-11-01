package com.cartify.configuration;

import com.cartify.domain.UserRole;
import com.cartify.modal.User;
import com.cartify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.Console;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.admin-password-reset", name = "enabled", havingValue = "true")
public class AdminPasswordResetRunner implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.admin-password-reset.email:}")
    private String adminEmail;

    @Override
    public void run(ApplicationArguments args) {
        Console console = System.console();
        if (console == null) {
            throw new IllegalStateException(
                    "No interactive console is available. Run the reset command directly in a terminal."
            );
        }
        if (adminEmail == null || adminEmail.isBlank()) {
            throw new IllegalArgumentException("Set app.admin-password-reset.email to the existing admin email.");
        }

        User admin = userRepository.findByEmail(adminEmail.trim());
        if (admin == null || admin.getRole() != UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("No super-admin account exists for the supplied email.");
        }

        boolean emailConfirmed = false;
        for (int attempt = 1; attempt <= 3; attempt++) {
            String confirmation = console.readLine(
                    "Reset password for %s? Type the full email to confirm: ", admin.getEmail());
            if (admin.getEmail().equalsIgnoreCase(confirmation == null ? "" : confirmation.trim())) {
                emailConfirmed = true;
                break;
            }
            console.printf("Email did not match. Attempts remaining: %d.%n", 3 - attempt);
        }
        if (!emailConfirmed) {
            console.printf("Password was not changed. The application will continue starting normally.%n");
            return;
        }

        for (int attempt = 1; attempt <= 3; attempt++) {
            char[] first = console.readPassword("New password (minimum 12 characters): ");
            char[] second = console.readPassword("Re-enter the exact same password: ");
            try {
                if (first == null || first.length < 12) {
                    console.printf("Password must contain at least 12 characters. Attempts remaining: %d.%n", 3 - attempt);
                    continue;
                }
                if (!Arrays.equals(first, second)) {
                    console.printf("The entries did not match. Attempts remaining: %d.%n", 3 - attempt);
                    continue;
                }
                admin.setPassword(passwordEncoder.encode(new String(first)));
                userRepository.save(admin);
                console.printf("Password reset completed for %s. No password was displayed.%n", admin.getEmail());
                return;
            } finally {
                if (first != null) Arrays.fill(first, '\0');
                if (second != null) Arrays.fill(second, '\0');
            }
        }
        console.printf("Password was not changed. The application will continue starting normally.%n");
    }
}