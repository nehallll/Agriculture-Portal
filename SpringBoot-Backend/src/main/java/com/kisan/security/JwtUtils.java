package com.kisan.security;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtils {

	@Value("${spring.security.jwt.secret.key}") //example of value injected as dependency , using SpEL
	private String jwtSecret;

	@Value("${spring.security.jwt.exp.time}")
	private int jwtExpirationMs;
	
	private Key key;

	@PostConstruct
	public void init() {
		key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
	}

	
	public String generateJwtToken(Authentication authentication) {
		log.info("generate jwt token " + authentication);
		CustomUserDetailsImpl userPrincipal = (CustomUserDetailsImpl) authentication.getPrincipal();
		return Jwts.builder() 
				.setSubject((userPrincipal.getUsername())) /
				.setIssuedAt(new Date())
				.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))/
				.claim("authorities", getAuthoritiesInString(userPrincipal.getAuthorities()))
				.claim("user_id",userPrincipal.getUserEntity().getId())
		
				.signWith(key, SignatureAlgorithm.HS256) 
				.compact();
	}

	// this method will be invoked by our custom JWT filter
	public String getUserNameFromJwtToken(Claims claims) {
		return claims.getSubject();
	}

	// this method will be invoked by our custom JWT filter
	public Claims validateJwtToken(String jwtToken) {
		// try {
		Claims claims = Jwts.parserBuilder() 
				.setSigningKey(key) 
				.build()
				.parseClaimsJws(jwtToken) 
				.getBody();
		
		return claims;		
	}
	

	private String getAuthoritiesInString(Collection<? extends GrantedAuthority> authorities) {
		String authorityString = authorities.stream().
				map(authority -> authority.getAuthority())
				.collect(Collectors.joining(","));
		System.out.println(authorityString);
		return authorityString;
	}
		public List<GrantedAuthority> getAuthoritiesFromClaims(Claims claims) {
		String authString = (String) claims.get("authorities");
		List<GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(authString);
		authorities.forEach(System.out::println);
		return authorities;
	}
	
		public Long getUserIdFromJwtToken(Claims claims) {
		    Object userIdObj = claims.get("user_id");
		    if (userIdObj instanceof Integer) {
		        return ((Integer) userIdObj).longValue();
		    } else if (userIdObj instanceof String) {
		        return Long.valueOf((String) userIdObj);
		    }
		    throw new IllegalArgumentException("Invalid user_id type in JWT");
		}
		
		private Long getUserIdFromAuthentication(Authentication authentication) {
		    Claims claims = validateJwtToken((String) authentication.getCredentials());
		    return getUserIdFromJwtToken(claims); // Extract the userId from the JWT claims
		}

			
			public Authentication populateAuthenticationTokenFromJWT(String jwt) {
				// validate JWT n retrieve JWT body (claims)
				Claims payloadClaims = validateJwtToken(jwt);
				// get user name from the claims
				String email = getUserNameFromJwtToken(payloadClaims);
				// get granted authorities as a custom claim
				List<GrantedAuthority> authorities = getAuthoritiesFromClaims(payloadClaims);
				// get userId as the custom claim		
				Long userId=getUserIdFromJwtToken(payloadClaims);
				// add user name/email , user id n  granted authorities in Authentication object
				UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(email,userId,
						authorities);
				System.out.println("is authenticated "+token.isAuthenticated());//true
				return token;
		
			}

}
