package com.kisan.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration 
@EnableWebSecurity 
public class SecurityConfiguration {
	@Autowired
	private CustomJWTAuthenticationFilter customJWTAuthenticationFilter;
	
		@Bean
		SecurityFilterChain authorizeRequests(HttpSecurity http) throws Exception
		{
			//1. Disable CSRF filter
			http
			.csrf(customizer -> customizer.disable())
			//2. configure URL based access
	        

	        
	        
	        .sessionManagement(session 
	        		-> session.sessionCreationPolicy(
	        				SessionCreationPolicy.STATELESS));
			//adding custom JWT filter before any AUTH filter
			
			
			
			
			http.addFilterBefore(customJWTAuthenticationFilter, 
					UsernamePasswordAuthenticationFilter.class);
	        return http.build();
		}
		
		
		//to supply AUTH Manager , configure it as a spring bean
		
		
		@Bean
		AuthenticationManager authenticationManager
		(AuthenticationConfiguration config) throws Exception
		{
			return config.getAuthenticationManager();
		}

}
