package com.kisan.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kisan.pojo.Orders;
import com.kisan.pojo.UserEntity;

public interface OrderDao extends JpaRepository<Orders, Long>{
	List<Orders> findByUser(UserEntity user);
}
