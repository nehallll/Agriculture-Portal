package com.kisan.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(Include.NON_EMPTY)
public class CartItemDto extends BaseDto{

	private Long id; // Unique identifier for the entity
	private String name;
    private int quantity;          // Quantity of the product in the cart
    private double price;          // Total price (product price * quantity)
}
