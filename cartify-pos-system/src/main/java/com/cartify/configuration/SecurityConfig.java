package com.cartify.configuration;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174,http://localhost:3000,https://cartify-pos-system.vercel.app}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        return http
                .sessionManagement(
                        management -> management.sessionCreationPolicy
                                (SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(Authorize ->
                        Authorize
                                // specific rules FIRST (most restrictive -> least restrictive)
                                .requestMatchers("/api/super-admin/**").hasAuthority("ROLE_ADMIN")
                                .requestMatchers("/api/**").authenticated()
                                // auth endpoints: login/signup are public
                                .requestMatchers("/auth/login", "/auth/signup").permitAll()
                                // protect auth update and user list (require authentication)
                                .requestMatchers("/auth/update/**").authenticated()
                                .requestMatchers("/users/list").authenticated()
                                .anyRequest().permitAll()
                ).addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(
                        cors -> cors.configurationSource(corsConfigurationSource())
                ).build();


    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();
                
                List<String> origins = new ArrayList<>(
                        Arrays.stream(allowedOrigins.split(","))
                                .map(String::trim)
                                .filter(origin -> !origin.isEmpty())
                                .toList()
                );

                // Always ensure production Vercel frontend is allowed
                if (!origins.contains("https://cartify-pos-system.vercel.app")) {
                    origins.add("https://cartify-pos-system.vercel.app");
                }

                cfg.setAllowedOrigins(origins);
                cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }

}
