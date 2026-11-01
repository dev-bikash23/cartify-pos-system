package com.cartify.service.impl;

import com.cartify.exception.UserException;
import com.cartify.mapper.BranchMapper;
import com.cartify.modal.Branch;
import com.cartify.modal.Store;
import com.cartify.modal.User;
import com.cartify.payload.dto.BranchDTO;
import com.cartify.repository.BranchRepository;
import com.cartify.repository.StoreRepository;
import com.cartify.repository.UserRepository;
import com.cartify.service.BranchService;
import com.cartify.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {

private final BranchRepository branchRepository;
private final StoreRepository storeRepository;
private final UserService userService;
private final UserRepository userRepository;

    @Override
    public BranchDTO createBranch(BranchDTO branchDTO) throws UserException {
        User currentUser = userService.getCurrentUser();
        Store store =  storeRepository.findByStoreAdminId(currentUser.getId());

        Branch branch = BranchMapper.toEntity(branchDTO, store);
        if (branchDTO.getManager() != null && branchDTO.getManager().getFullName() != null) {
            User manager = userRepository.findFirstByFullNameIgnoreCase(
                    branchDTO.getManager().getFullName().trim()
            );
            if (manager == null) {
                throw new UserException("Manager user not found: " + branchDTO.getManager().getFullName());
            }
            branch.setManager(manager);
        }
        Branch saveBranch = branchRepository.save(branch);
        return BranchMapper.toDTO(saveBranch);
    }

    @Override
    public BranchDTO updateBranch(Long id, BranchDTO branchDTO) throws Exception {
        Branch exiting = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not exist")
        );
        exiting.setName(branchDTO.getName());
        exiting.setWorkingDays(branchDTO.getWorkingDays());
        exiting.setEmail(branchDTO.getEmail());
        exiting.setPhone(branchDTO.getPhone());
        exiting.setAddress(branchDTO.getAddress());
        exiting.setOpenTime(branchDTO.getOpenTime());
        exiting.setCloseTime(branchDTO.getCloseTime());
        if (branchDTO.getManager() != null && branchDTO.getManager().getFullName() != null) {
            User manager = userRepository.findFirstByFullNameIgnoreCase(
                    branchDTO.getManager().getFullName().trim()
            );
            if (manager == null) {
                throw new UserException("Manager user not found: " + branchDTO.getManager().getFullName());
            }
            exiting.setManager(manager);
        }
        exiting.setUpdatedAt(LocalDateTime.now());

        Branch updatedBranch = branchRepository.save(exiting);
        return BranchMapper.toDTO(updatedBranch);

    }

    @Override
    @Transactional
    public void deleteBranch(Long id) throws Exception {
        Branch exiting = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not exist")
        );

        List<User> branchUsers = userRepository.findByBranchId(id);
        branchUsers.forEach(user -> user.setBranch(null));
        userRepository.saveAll(branchUsers);
        exiting.setManager(null);
        branchRepository.delete(exiting);
    }

    @Override
    public List<BranchDTO> getAllBranchesByStoreId(Long storeId) {
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        return branches.stream().map(BranchMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BranchDTO getBranchById(Long id) throws Exception {
        Branch exiting = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not exist")
        );
        return BranchMapper.toDTO(exiting);
    }
}
