package com.cartify.service.impl;

import com.cartify.mapper.ProductMapper;
import com.cartify.modal.Category;
import com.cartify.modal.Product;
import com.cartify.modal.Store;
import com.cartify.modal.User;
import com.cartify.modal.Branch;
import com.cartify.modal.Inventory;
import com.cartify.repository.BranchRepository;
import com.cartify.repository.InventoryRepository;
import com.cartify.payload.dto.ProductDTO;
import com.cartify.repository.CategoryRepository;
import com.cartify.repository.ProductRepository;
import com.cartify.repository.StoreRepository;
import com.cartify.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
        private final BranchRepository branchRepository;
        private final InventoryRepository inventoryRepository;

    @Override
    public ProductDTO createProduct(ProductDTO productDTO, User user) throws Exception {
        Store store = storeRepository.findById(
                productDTO.getStoreId()
        ).orElseThrow(
                () -> new Exception("Store not found")
        );
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(
                        () -> new Exception("category not found")
                );


        Product product = ProductMapper.toEntity(productDTO, store, category);
        Product saveProduct = productRepository.save(product);
        syncStock(saveProduct, productDTO.getStock());
        return toDTOWithStock(saveProduct);

    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO, User user) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(
                () -> new Exception("product not found")
        );

        if(productDTO.getCategoryId()!=null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(
                    () -> new Exception("Category not found")
            );
            product.setCategory(category);
        }


        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setSku(productDTO.getSku());
        product.setImage(productDTO.getImage());
        product.setMrp(productDTO.getMrp());
        product.setSellingPrice(productDTO.getSellingPrice());
        product.setBrand(productDTO.getBrand());
        product.setUpdatedAt(LocalDateTime.now());

        if(productDTO.getCategoryId()!=null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(
                    () -> new Exception("Category not found")
            );
            product.setCategory(category);
        }

        Product saveProduct = productRepository.save(product);
        syncStock(saveProduct, productDTO.getStock());
        return toDTOWithStock(saveProduct);
    }

    @Override
    public void deleteProduct(Long id, User user) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(
                () -> new Exception("product not found")
        );
                product.setActive(false);
                productRepository.save(product);

    }

    @Override
    public List<ProductDTO> getProductsByStoreId(Long storeId) {
        List<Product> products = productRepository.findByStoreIdAndActiveTrue(storeId);
        return products.stream().map(this::toDTOWithStock).collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> searchByKeyword(Long storeId, String keyword) {
        List<Product> products = productRepository.searchByKeyword(storeId, keyword);
                return products.stream().map(this::toDTOWithStock).collect(Collectors.toList());
    }

        private ProductDTO toDTOWithStock(Product product) {
                ProductDTO dto = ProductMapper.toDTO(product);
                int stock = inventoryRepository.findByProduct_Store_Id(product.getStore().getId()).stream()
                        .filter(inventory -> inventory.getProduct().getId().equals(product.getId()))
                                .mapToInt(inventory -> inventory.getQuantity() == null ? 0 : inventory.getQuantity())
                                .sum();
                dto.setStock(stock);
                return dto;
        }

        private void syncStock(Product product, Integer quantity) {
                if (quantity == null) return;
                List<Branch> branches = branchRepository.findByStoreId(product.getStore().getId());
                for (Branch branch : branches) {
                            Inventory inventory = inventoryRepository.findFirstByProductIdAndBranchId(product.getId(), branch.getId());
                        if (inventory == null) {
                                inventory = Inventory.builder().product(product).branch(branch).build();
                        }
                        inventory.setQuantity(quantity);
                        inventoryRepository.save(inventory);
                }
        }
}










