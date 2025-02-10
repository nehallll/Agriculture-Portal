package com.kisan.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AuthorizationRequest {
	@NotBlank(message = "Email cannot be null or blank")
	@Email(message = "Invalid Email Format")
	private String email;
	@NotBlank
	private String password;
}
