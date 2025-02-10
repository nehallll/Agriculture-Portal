package com.kisan.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kisan.pojo.CartItem;

public interface CartItemDao extends JpaRepository<CartItem, Long>{

}
