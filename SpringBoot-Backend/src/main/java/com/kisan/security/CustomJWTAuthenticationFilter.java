package com.kisan.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomJWTAuthenticationFilter extends OncePerRequestFilter {
	@Autowired
	private JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(HttpServletRequest request,
	                                HttpServletResponse response, 
	                                FilterChain filterChain)
	        throws ServletException, IOException {
	    
	    // Set CORS headers
	    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	    response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
	    response.setHeader("Access-Control-Allow-Credentials", "true");

	    // Handle preflight requests
	    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
	        response.setStatus(HttpServletResponse.SC_OK);
	        return;
	    }

	    System.out.println("in CustomJWTAuthenticationFilter");
	    
	    // 1. Check authorization header from incoming request
	    String authHeader = request.getHeader("Authorization");

	    // 2. Check if it's not null and starts with "Bearer"
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        System.out.println("Token with Bearer present");

	        // 3. Extract JWT
	        String jwt = authHeader.substring(7);

	        // 4. Validate JWT and get authentication object
	        Authentication authentication = jwtUtils.populateAuthenticationTokenFromJWT(jwt);

	        // 5. Store auth object in security context
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	        System.out.println("Saved auth details under Spring Security context!");
	    }

	    // Continue with remaining filter chain.
	    filterChain.doFilter(request, response);
	}

}
