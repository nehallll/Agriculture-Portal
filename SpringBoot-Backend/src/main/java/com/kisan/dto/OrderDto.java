package com.kisan.dto;

import java.util.List;

import com.kisan.pojo.OrderItem;
import com.kisan.pojo.Orders.OrderStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDto {
    private List<OrderItemDto> items;
    private double totalAmount;
    private OrderStatus status;
}
