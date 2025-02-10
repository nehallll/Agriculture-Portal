package com.kisan.service;

import java.util.Collection;

import com.kisan.pojo.CartItem;

public interface CartService {
	void addToCart(Long userId, Long productId, int quantity);

	Collection<CartItem> getCartItems(Long userId);
}
