package com.kisan.service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kisan.custom_exceptions.ResourceNotFoundException;
import com.kisan.dao.CartDao;
import com.kisan.dao.ProductDao;
import com.kisan.dao.UserDao;
import com.kisan.dto.OrderItemDto;
import com.kisan.pojo.Cart;
import com.kisan.pojo.CartItem;
import com.kisan.pojo.Products;
import com.kisan.pojo.UserEntity;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CartServiceImpl implements CartService {
    @Autowired private CartDao cartDao;
    @Autowired private ProductDao productDao;
    @Autowired private UserDao userDao;

    public void addToCart(Long userId, Long productId, int quantity) {
        Products product = productDao.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (!product.isMarkedForSale() || product.getStockToSell() < quantity) {
            throw new IllegalArgumentException("Product not available for sale in the requested quantity");
        }
        UserEntity user = userDao.findById(userId).get();
        Cart cart = cartDao.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartDao.save(newCart);
                });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.addItem(newItem);
        }

        cartDao.save(cart);
    }

	@Override
	public List<CartItem> getCartItems(Long userId) {
        UserEntity user = userDao.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getActiveCart().getItems();
    }
}