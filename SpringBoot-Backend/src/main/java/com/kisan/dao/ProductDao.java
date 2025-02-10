package com.kisan.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kisan.pojo.FarmingType;
import com.kisan.pojo.Products;
import com.kisan.pojo.UserEntity;

public interface ProductDao extends JpaRepository<Products, Long> {
	List<Products> findByStatusTrue();
	List<Products> findByStatusFalse();
	List<Products> findByFarmingType(FarmingType farmingType);
//	List<Products> getAllProducts();
//	List<Products> findByIdAndStatusTrue(Long id);
	List<Products> findByStatusTrueAndUserId(Long id);
	List<Products> findByFarmingTypeAndStatusTrue(String farmingType);
	//Optional<UserEntity> findByStatusTrue(Long userId);
	Optional<Products> findByUserIdAndStatusTrue(Long userId);
	Optional<Products> findByIdAndStatusTrue(Long id);
	Optional<UserEntity> findByIdAndUserIdAndStatusTrue(Long productId, Long userId);
	
	List<Products> findByUserId(Long userId);
	List<Products> findByFarmingType(String farmingType);
	List<Products> findByMarkedForSaleTrue();
}