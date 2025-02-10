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
    public String getImageType(Long id) {
    	Products product = productDao.findById(id).orElseThrow();
    	return product.getImageType();
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
//        List<Products> products = productDao.findAll();
//        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }
    

    @Override
    public ProductResponseDto getAProduct(Long id) {
        Products product = productDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return convertToDto(product);
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
    
    

}