package com.kisan.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.kisan.custom_exceptions.ResourceNotFoundException;
import com.kisan.dao.ProductDao;
import com.kisan.dao.UserDao;
import com.kisan.dto.ApiResponse;
import com.kisan.dto.ProductRequestDto;
import com.kisan.dto.ProductResponseDto;
import com.kisan.dto.ProductsDto;
import com.kisan.dto.SellProductRequestDto;
import com.kisan.pojo.FarmingType;
import com.kisan.pojo.MetricType;
import com.kisan.pojo.Products;
import com.kisan.pojo.UserEntity;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @Override
    public ApiResponse addProduct(ProductRequestDto dto, MultipartFile productImage, Long userId) {
        // Fetch user from DB
        UserEntity user = userDao.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Products product = new Products();
        product.setProductName(dto.getProductName());
        product.setProductType(dto.getProductType());
        product.setTotalStock(dto.getTotalStock());
        product.setMetric(dto.getMetric());
        product.setLandArea(dto.getLandArea());
        product.setFarmingType(dto.getFarmingType());
        product.setPrice(0);
        product.setStockToSell(0);
        product.setUser(user); 
        if (productImage != null && !productImage.isEmpty()) {
            try {
                product.setProductImage(productImage.getBytes());
                product.setImageName(productImage.getName());
                product.setImageType(productImage.getContentType());
            } catch (Exception e) {
                return new ApiResponse("Failed to upload product image: " + e.getMessage());
            }
        }
        productDao.save(product);

        return new ApiResponse("Added new product with ID " + product.getId());
    }
    
    @Override
    public byte[] getProductImage(Long id) {
    	Products product = productDao.findById(id).orElseThrow();
    	return product.getProductImage();
    }
    
    @Override
    public String getImageType(Long id) {
    	Products product = productDao.findById(id).orElseThrow();
    	return product.getImageType();
    }

    
    @Override
    public Object updateProduct(Long id, ProductRequestDto productDto, MultipartFile productImage) {
        Products product = productDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
        product.setProductName(productDto.getProductName());
        product.setProductType(productDto.getProductType());
        product.setTotalStock(productDto.getTotalStock());
        product.setMetric(productDto.getMetric());
        product.setLandArea(productDto.getLandArea());

        if (productImage != null && !productImage.isEmpty()) {
        	try {
                product.setProductImage(productImage.getBytes());
                product.setImageName(productImage.getName());
                product.setImageType(productImage.getContentType());
            } catch (Exception e) {
                return new ApiResponse("Failed to upload product image: " + e.getMessage());
            }  
        }
        productDao.save(product);
        return new ApiResponse("Product updated successfully");
    }


    @Override
    public ApiResponse deleteProductDetails(Long productId) {
        Products product = productDao.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStatus(false);
        productDao.save(product);
        return new ApiResponse("Product deleted successfully");
    }

    @Override
    public List<ProductResponseDto> getUserProducts(Long userId) {
        List<Products> products = productDao.findByUserId(userId);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDto> getAllProducts(int pageNumber, int pageSize) {
    	Pageable pageable = PageRequest.of(pageNumber, pageSize);
    	Page<Products> products = productDao.findAll(pageable);
    	return products.getContent().stream().map(this::convertToDto).collect(Collectors.toList());

    }


    @Override
    public ProductResponseDto getAProduct(Long id) {
        Products product = productDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return convertToDto(product);
    }

    @Override
    public ApiResponse markForSale(SellProductRequestDto dto, Long id) {
        Products product = productDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStockToSell(dto.getStockToSell());
        product.setPrice(dto.getPrice());
        product.setMarkedForSale(true);

        productDao.save(product);
        return new ApiResponse("Product marked for sale");
    }

    @Override
    public List<ProductResponseDto> getProductsByFarmingType(FarmingType farmingType) {
        List<Products> products = productDao.findByFarmingType(farmingType);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }


    private ProductResponseDto convertToDto(Products product) {
        return new ProductResponseDto(
        		
        		product.getId(),
                product.getProductName(),
                product.getProductType().toString(),
                product.getPrice(),
                product.getTotalStock(),
                product.getStockToSell(),
                product.isMarkedForSale(),
                product.getMetric(),
                product.getFarmingType().toString(),
                product.getLandArea()    
        );
    }
    
    
    @Override
    public List<ProductsDto> getProductsMarkedForSale() {
    	List<Products> products = productDao.findByMarkedForSaleTrue();
        return products.stream().map(this::convert).collect(Collectors.toList());
    }
    
    private ProductsDto convert(Products products) {
    	return new ProductsDto(
    			products.getId(),
    			products.getProductName(),
    			products.getPrice());
    }
}
    






