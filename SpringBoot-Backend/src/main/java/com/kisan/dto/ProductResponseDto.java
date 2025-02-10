package com.kisan.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.kisan.pojo.FarmingType;
import com.kisan.pojo.MetricType;
import com.kisan.pojo.ProductType;

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
public class ProductResponseDto extends BaseDto{

	 	  private Long id;
		  private String productName;
		  private String productType;
		  private int price; // to be added when user sells
		  private int totalStock; //the amount user has:
		  private int stockToSell; //the amount user wants to sell, cannot be less that total stock:
		  private boolean markedForSale; //when the user lists the item for selling
		  private MetricType metric; //kg,l,unit
		  private String farmingType;
		  private double landArea; //stored in acres
}