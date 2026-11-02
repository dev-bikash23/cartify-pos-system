package com.cartify.service.impl;

import com.cartify.domain.UserRole;
import com.cartify.mapper.CategoryMapper;
import com.cartify.modal.Category;
import com.cartify.modal.Store;
import com.cartify.modal.User;
import com.cartify.payload.dto.CategoryDTO;
import com.cartify.repository.CategoryRepository;
import com.cartify.repository.StoreRepository;
import com.cartify.service.CategoryService;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final StoreRepository storeRepository;

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) throws Exception {
        User user = userService.getCurrentUser();

        Store store = storeRepository.findById(dto.getStoreId()).orElseThrow(
                () -> new Exception("Store not found")
        );

        Category category = Category.builder()
                .store(store)
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        checkAuthority(user, category.getStore());

        return CategoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public List<CategoryDTO> getCategoriesByStore(Long storeId) {
        List<Category> categories = categoryRepository.findByStoreId(storeId);
        return categories.stream()
                .map(
                        CategoryMapper::toDTO
                ).collect(Collectors.toList());
    }

    @Override
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) throws Exception {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new Exception("category not exist")
        );
        User user = userService.getCurrentUser();

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        checkAuthority(user, category.getStore());
        return CategoryMapper.toDTO(categoryRepository.save(category));

    }

    @Override
    public void deleteCategory(Long id) throws Exception {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new Exception("category not exist")
        );
        User user = userService.getCurrentUser();

        checkAuthority(user, category.getStore());

        categoryRepository.delete(category);
    }

    private void checkAuthority(User user, Store store) throws Exception {
        boolean isSuperAdmin = user.getRole().equals(UserRole.ROLE_ADMIN);
        boolean isStoreAdmin = user.getRole().equals(UserRole.ROLE_STORE_ADMIN);
        boolean isStoreManager = user.getRole().equals(UserRole.ROLE_STORE_MANAGER);
        boolean isOwnerOfThisStore = user.equals(store.getStoreAdmin());
        boolean isCashierAtThisStore = user.getBranch() != null
                && user.getBranch().getStore() != null
                && user.getBranch().getStore().getId().equals(store.getId());

        boolean isAuthorized =
                isSuperAdmin
                        || isStoreManager
                        || (isStoreAdmin && isOwnerOfThisStore)
                        || isCashierAtThisStore;

        if (!isAuthorized) {
            throw new Exception("you don't have permission to manage this category");
        }
    }
     //  Pablo => Cashier
}









