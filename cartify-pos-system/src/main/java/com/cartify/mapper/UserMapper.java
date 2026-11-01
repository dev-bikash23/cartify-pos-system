package com.cartify.mapper;

import com.cartify.modal.User;
import com.cartify.payload.dto.UserDto;

public class UserMapper {


    public static UserDto toDTO(User savedUser) {
        UserDto userDto = new UserDto();

        userDto.setId(savedUser.getId());
        userDto.setFullName(savedUser.getFullName());
        userDto.setEmail(savedUser.getEmail());
        userDto.setRole(savedUser.getRole());
        userDto.setActive(savedUser.isActive());
        userDto.setCreatedAt(savedUser.getCreatedAt());
        userDto.setUpdatedAt(savedUser.getUpdatedAt());
        userDto.setLastLogin(savedUser.getLastLogin());
        userDto.setPhone(savedUser.getPhone());
        userDto.setProfilePicture(savedUser.getProfilePicture());
        userDto.setBranchId(savedUser.getBranch()!=null? savedUser.getBranch().getId():null);
        userDto.setStoreId(savedUser.getStore()!=null? savedUser.getStore().getId():null);

        return userDto;
    }

    public static User toEntity(UserDto userDto) {
        User createdUser = new User();
        //createdUser.setId(userDto.getId);
        createdUser.setEmail(userDto.getEmail());
        createdUser.setFullName(userDto.getFullName());
        createdUser.setRole(userDto.getRole());
        createdUser.setActive(userDto.isActive());
        createdUser.setCreatedAt(userDto.getCreatedAt());
        createdUser.setUpdatedAt(userDto.getUpdatedAt());
        createdUser.setLastLogin(userDto.getLastLogin());
        createdUser.setPhone(userDto.getPhone());
        createdUser.setProfilePicture(userDto.getProfilePicture());
        createdUser.setPassword(userDto.getPassword());

        return createdUser;

    }
}
