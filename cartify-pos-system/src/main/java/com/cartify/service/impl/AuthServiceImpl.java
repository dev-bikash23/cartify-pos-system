package com.cartify.service.impl;

import com.cartify.configuration.JwtProvider;
import com.cartify.domain.UserRole;
import com.cartify.exception.UserException;
import com.cartify.mapper.UserMapper;
import com.cartify.modal.User;
import com.cartify.modal.Store;
import com.cartify.payload.dto.UserDto;
import com.cartify.payload.response.AuthResponse;
import com.cartify.repository.UserRepository;
import com.cartify.repository.StoreRepository;
import com.cartify.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;
    private final StoreRepository storeRepository;


    @Override
    public AuthResponse signup(UserDto userDto) throws UserException {
        User user = userRepository.findByEmail(userDto.getEmail());
        if(user != null) {
            throw new UserException("email id already registered !");
        }
        if(userDto.getRole().equals(UserRole.ROLE_ADMIN)) {
            throw new UserException("role admin is not allowed !");
        }
        User newUser = new User();
        newUser.setEmail(userDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setRole(userDto.getRole());
        newUser.setFullName(userDto.getFullName());
        newUser.setPhone(userDto.getPhone());
        newUser.setBusinessName(userDto.getBusinessName());
        newUser.setBusinessType(userDto.getBusinessType());
        newUser.setBusinessAddress(userDto.getBusinessAddress());
        newUser.setBusinessWebsite(userDto.getBusinessWebsite());
        newUser.setLastLogin(LocalDateTime.now());
        newUser.setCreatedAt(LocalDateTime.now());

      User savedUser = userRepository.save(newUser);
        if (userDto.getRole() == UserRole.ROLE_STORE_ADMIN
                && userDto.getBusinessName() != null
                && !userDto.getBusinessName().isBlank()) {
            Store store = new Store();
            store.setBrand(userDto.getBusinessName().trim());
            store.setStoreType(userDto.getBusinessType());
            store.setDescription(userDto.getBusinessAddress());
            store.setStoreAdmin(savedUser);
            storeRepository.save(store);
        }

        UserDetails userDetails =
                customUserImplementation.loadUserByUsername(userDto.getEmail());

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Registered Successfully");
        authResponse.setUserDto(UserMapper.toDTO(savedUser));

        return authResponse;
    }

    @Override
    public AuthResponse login(UserDto userDto) throws UserException {
        String email = userDto.getEmail();
        String password = userDto.getPassword();

        Authentication authentication = authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.iterator().next().getAuthority();

        String jwt = jwtProvider.generateToken(authentication);

        User user = userRepository.findByEmail(email);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successfully");
        authResponse.setUserDto(UserMapper.toDTO(user));

        return authResponse;
    }


    private Authentication authenticate(String email, String password) throws UserException {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("email id doesn't exist" + email);
        }
        if (!user.isActive()) {
            throw new UserException("user is inactive");
        }

        UserDetails userDetails = customUserImplementation.loadUserByUsername(email);
        if( userDetails == null) {
            throw new UserException("email id doesn't exist" + email);
        }
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("password doesn't match");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }


    public UserDto updateUser(Long id, UserDto userDto) throws UserException {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found"));

        if (userDto.getFullName() != null) {
            user.setFullName(userDto.getFullName());
        }
        if (userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }
        if (userDto.getPhone() != null) {
            user.setPhone(userDto.getPhone());
        }
        if (userDto.getBusinessName() != null) {
            user.setBusinessName(userDto.getBusinessName());
        }
        if (userDto.getBusinessType() != null) {
            user.setBusinessType(userDto.getBusinessType());
        }
        if (userDto.getBusinessAddress() != null) {
            user.setBusinessAddress(userDto.getBusinessAddress());
        }
        if (userDto.getBusinessWebsite() != null) {
            user.setBusinessWebsite(userDto.getBusinessWebsite());
        }
        if (userDto.getProfilePicture() != null) {
            user.setProfilePicture(userDto.getProfilePicture());
        }

        if (userDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        if (userDto.getRole() != null) {
            user.setRole(userDto.getRole());
        }

        User updatedUser = userRepository.save(user);

        return UserMapper.toDTO(updatedUser);
    }
}



















