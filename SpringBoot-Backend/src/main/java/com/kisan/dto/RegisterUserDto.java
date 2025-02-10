package com.kisan.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.kisan.pojo.FarmingType;
import com.kisan.pojo.UserRole;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserDto extends BaseDto{
	
	@NotBlank
	private String firstName;
	private String lastName;
	private String email;	
	@JsonProperty(access=Access.WRITE_ONLY)
	private String password;
	private String mobile;	
	private String gender;
	private String adrLine1;
	private String adrLine2;
	private String city;
	private String state;
	private String zipCode;
	//private String imageName;
	//private String imageType;
	private UserRole role;
	private FarmingType farmingType;
	
}
