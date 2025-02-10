
package com.kisan.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
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
public class ProductRequestDto
{
	  private String productName;
	  @JsonFormat(shape = JsonFormat.Shape.STRING)
	  private ProductType productType;
	  private FarmingType farmingType;
	  private int totalStock; //the amount user has:
	  @JsonFormat(shape = JsonFormat.Shape.STRING)
	  private MetricType metric; //kg,l,unit
	  private double landArea; //stored in acres
}
