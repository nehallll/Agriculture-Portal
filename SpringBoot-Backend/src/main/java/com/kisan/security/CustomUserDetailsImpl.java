package com.kisan.security;

import java.util.Collection;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.kisan.pojo.UserEntity;


public class CustomUserDetailsImpl implements UserDetails {
	private com.kisan.pojo.UserEntity userEntity;
	

	public CustomUserDetailsImpl(UserEntity userEntity) {
		super();
		this.userEntity = userEntity;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return List.of
				(new SimpleGrantedAuthority(
						userEntity.getRole().name()));
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return userEntity.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return userEntity.getEmail();
	}

	public UserEntity getUserEntity() {
		return userEntity;
	}
	

}
