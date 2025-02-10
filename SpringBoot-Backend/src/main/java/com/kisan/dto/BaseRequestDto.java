package com.kisan.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseRequestDto {
	//used during ser.
	@JsonProperty(access = Access.READ_ONLY)
	private Long id;
	
}