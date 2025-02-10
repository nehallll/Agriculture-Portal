package com.kisan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kisan.dto.ApiResponse;
import com.kisan.dto.ProductRequestDto;
import com.kisan.dto.ProductResponseDto;
import com.kisan.dto.ProductsDto;
import com.kisan.dto.SellProductRequestDto;
import com.kisan.pojo.FarmingType;
import com.kisan.service.ProductService;

@RestController
@RequestMapping("/products")
@CrossOrigin
public class ProductController {
	
    @Autowired
    private ProductService productService;

    //view all products for ADMIN
    @GetMapping("/view")
    public ResponseEntity<?> viewAllProducts(@RequestParam(defaultValue = "0") int pageNumber,
            								@RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(productService.getAllProducts(pageNumber, pageSize));
    }

    
    //view all products of a particular farmer
    @GetMapping("/user-products")
    public ResponseEntity<?> getUserProducts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        Object credentials = authentication.getCredentials();
        Long userId;

        if (credentials instanceof Long) {
            userId = (Long) credentials;
        } else if (credentials instanceof String) {
            try {
                userId = Long.parseLong((String) credentials);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user id format");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid authentication credentials");
        }

        List<ProductResponseDto> userProducts = productService.getUserProducts(userId);
        if (userProducts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(userProducts);
    }



    //get a product based on id for farmer
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        System.out.println("User Authorities: " + authentication.getAuthorities());
        ProductResponseDto product = productService.getAProduct(id);
        return ResponseEntity.ok(product);
    }
    
    
    
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getUserImage(@PathVariable Long id){
    	 byte[] responseImage = productService.getProductImage(id);
    	 return ResponseEntity.ok().contentType(MediaType.valueOf(productService.getImageType(id))).body(responseImage);
    } 

    //get products based on farming type
    @GetMapping("/farming-type/{farmingType}")
    public ResponseEntity<?> getProductsByFarmingType(@PathVariable FarmingType farmingType) {
        List<ProductResponseDto> products = productService.getProductsByFarmingType(farmingType);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(products);
    }
    
    
    //add product for farmer
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestPart("product") String productJson,  
    		@RequestPart(value = "productImage", required = false) MultipartFile productImage) 
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getCredentials() instanceof Long)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long userId = (Long) authentication.getCredentials(); 
        ObjectMapper objectMapper = new ObjectMapper();
        ProductRequestDto product;
        try {
            product = objectMapper.readValue(productJson, ProductRequestDto.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid product json format!");
        }
        ApiResponse savedProduct = productService.addProduct(product, productImage, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    //update product details for farmer
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProductDetails(
            @RequestPart("product") ProductRequestDto product,
            @RequestPart(value = "productImage", required = false) MultipartFile productImage,
            @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK)
		        .body(productService.updateProduct(id, product, productImage));
    }

    //delete product for farmer
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(productService.deleteProductDetails(id));
    }

    //mark a product for sale
    @PutMapping("/mark-sale/{id}")
    public ResponseEntity<?> markForSale(@RequestBody SellProductRequestDto dto, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.markForSale(dto, id));
    }
    
 // Get all products marked for sale
    @GetMapping("/for-sale")
    public ResponseEntity<?> getProductsForSale() {
        List<ProductsDto> products = productService.getProductsMarkedForSale();
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(products);
    }

}
