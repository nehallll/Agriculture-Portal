package com.kisan.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.kisan.pojo.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(Include.NON_EMPTY)
public class OrderResponseDto extends BaseDto
{ 
	    
    private double totalAmount; // Total cost of the order

    private OrderStatus status; // PENDING, SHIPPED, DELIVERED, CANCELLED

    private LocalDateTime orderDate;

    private String shippingAddress;
	
}
