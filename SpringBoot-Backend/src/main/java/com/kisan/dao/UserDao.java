package com.kisan.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kisan.pojo.FarmingType;
import com.kisan.pojo.UserEntity;
import com.kisan.pojo.UserRole;

public interface UserDao extends JpaRepository<UserEntity, Long>{

	Optional<UserEntity> findByEmail(String email);

	Optional<UserEntity> findByIdAndStatusTrue(Long id);

	char[] existsByPassword(String string);

	boolean existsByEmail(String email);

	List<UserEntity> findByFarmingType(FarmingType type);

	List<UserEntity> findByRole(UserRole role);
	
	List<UserEntity> findByStatusTrue();


}
