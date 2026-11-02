package com.cartify.service.impl;

import com.cartify.domain.StoreStatus;
import com.cartify.exception.UserException;
import com.cartify.mapper.StoreMapper;
import com.cartify.modal.Store;
import com.cartify.modal.StoreContact;
import com.cartify.modal.User;
import com.cartify.payload.dto.StoreDTO;
import com.cartify.repository.StoreRepository;
import com.cartify.service.StoreService;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public StoreDTO createStore(StoreDTO storeDto, User user) {
        Store store = StoreMapper.toEntity(storeDto, user);
        return StoreMapper.toDTO(storeRepository.save(store));
    }

    @Override
    public StoreDTO getStoreById(Long id) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found....")
        );
        return StoreMapper.toDTO(store);
    }

    @Override
    public List<StoreDTO> getAllStores() {
        List<Store> dtos = storeRepository.findAll();
        return dtos.stream().map(StoreMapper::toDTO).collect(Collectors.toList());

    }

    @Override
    public Store getStoreByAdminById() throws UserException {
        return null;
    }

    @Override
    public Store getStoreByAdmin() throws UserException {
        User currentUser = userService.getCurrentUser();
        Store store = currentUser.getStore();
        if (store == null) {
            store = storeRepository.findByStoreAdminId(currentUser.getId());
        }

        if (store == null && currentUser.getRole() == com.cartify.domain.UserRole.ROLE_STORE_ADMIN
                && currentUser.getBusinessName() != null
                && !currentUser.getBusinessName().isBlank()) {
            store = new Store();
            store.setBrand(currentUser.getBusinessName().trim());
            store.setStoreType(currentUser.getBusinessType());
            store.setDescription(currentUser.getBusinessAddress());
            store.setStoreAdmin(currentUser);
            store = storeRepository.save(store);
        }

        if (store == null) {
            throw new UserException("No store is associated with this account");
        }

        return store;
    }

    @Override
    public StoreDTO updateStore(Long id, StoreDTO storeDTO) throws Exception {
        User currentUser = userService.getCurrentUser();

        Store existing = storeRepository.findById(id).orElse(null);

        if (existing == null) {
            throw new Exception("store not found");
        }

        boolean assignedToUser = currentUser.getStore() != null
                && currentUser.getStore().getId().equals(existing.getId());
        boolean storeAdmin = existing.getStoreAdmin() != null
                && existing.getStoreAdmin().getId().equals(currentUser.getId());
        if (!assignedToUser && !storeAdmin) {
            throw new Exception("you don't have permission to update this store");
        }

        existing.setBrand(storeDTO.getBrand());
        existing.setDescription(storeDTO.getDescription());

        if (storeDTO.getStoreType() != null) {
            existing.setStoreType(storeDTO.getStoreType());
        }
        if (storeDTO.getContact() != null) {
            StoreContact storeContact = StoreContact.builder()
                    .address(storeDTO.getContact().getAddress())
                    .phone(storeDTO.getContact().getPhone())
                    .email(storeDTO.getContact().getEmail())
                    .latitude(storeDTO.getContact().getLatitude())
                    .longitude(storeDTO.getContact().getLongitude())
                    .build();
            existing.setContact(storeContact);
        }
        Store updateStore = storeRepository.save(existing);
        return StoreMapper.toDTO(updateStore);

    }

    @Override
    public void deleteStore(Long id) throws UserException {
        Store store = getStoreByAdmin();

        storeRepository.delete(store);
    }

    @Override
    public StoreDTO getStoreByEmployee() throws UserException {
        User currentUser = userService.getCurrentUser();

        if (currentUser == null) {
            throw new UserException("You don't have permission to access this store");
        }

        return StoreMapper.toDTO(currentUser.getStore());
    }

    @Override
    public StoreDTO moderateStore(Long id, StoreStatus status) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found....")
        );
        store.setStatus(status);
        Store updateStore = storeRepository.save(store);
        return StoreMapper.toDTO(updateStore);
    }

}