package com.kisan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kisan.dto.CartItemDto;
import com.kisan.dto.OrderDto;
import com.kisan.dto.OrderItemDto;
import com.kisan.pojo.CartItem;
import com.kisan.pojo.Orders;
import com.kisan.service.CartService;
import com.kisan.service.OrderService;
import com.kisan.service.UserService;


@RestController
@CrossOrigin
public class CartController {
    @Autowired private CartService cartService;
    @Autowired private OrderService orderService;
    @Autowired private UserService userService;
    
    @PostMapping("/order/checkout")
    public ResponseEntity<OrderDto> checkout() {
        Long userId = userService.getUserByJwt().getId();
        Orders order;
        try {
            order = orderService.placeOrder(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok(convertToDto(order));
    }

    private OrderDto convertToDto(Orders order) {
        OrderDto dto = new OrderDto();
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());

        List<OrderItemDto> itemDTOs = order.getItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setProductId(item.getId());  // FIX: item instead of item1
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPrice(item.getPriceAtPurchase());
            return itemDto;
        }).toList();

        dto.setItems(itemDTOs);
        return dto;
    }

    
    @PostMapping("/cart/add/{productId}/{quantity}")
    public ResponseEntity<?> addToCart(	@PathVariable Long productId,
    									@PathVariable int quantity) {
    	Long user = userService.getUserByJwt().getId();
        cartService.addToCart(user, productId , quantity);
        return ResponseEntity.ok().build();
    }
    
    
    @GetMapping("/cart/view")
    public ResponseEntity<List<CartItemDto>> viewCart() {
        Long userId = userService.getUserByJwt().getId();
        List<CartItemDto> cartItems = cartService.getCartItems(userId)
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(cartItems);
    }

    private CartItemDto convertToDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getProduct().getId());
        dto.setName(cartItem.getProduct().getProductName());
        dto.setPrice(cartItem.getProduct().getPrice());
        dto.setQuantity(cartItem.getQuantity());
        return dto;
    }
    
    
    
}