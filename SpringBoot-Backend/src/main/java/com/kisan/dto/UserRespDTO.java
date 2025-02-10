package com.kisan.dto;

import com.kisan.pojo.UserRole;

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
public class UserRespDTO extends BaseDto{
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String gender;	
	private UserRole Role;

}


