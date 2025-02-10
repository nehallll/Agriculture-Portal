package com.kisan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kisan.custom_exceptions.ApiException;
import com.kisan.dto.ApiResponse;
import com.kisan.dto.AuthorizationRequest;
import com.kisan.dto.AuthorizationResponse;
import com.kisan.dto.ChangePasswordDto;
import com.kisan.dto.RegisterUserDto;
import com.kisan.dto.UpdateProfileDto;
import com.kisan.dto.UserDto;
import com.kisan.dto.UserListDto;
import com.kisan.dto.UserResponseDto;
import com.kisan.pojo.FarmingType;
import com.kisan.pojo.UserEntity;
import com.kisan.pojo.UserRole;
import com.kisan.security.JwtUtils;
import com.kisan.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtUtils jwtUtils;


    //Register user with image implementation using Multi-Part Response
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addUser(@RequestPart String user,
    								 @RequestPart MultipartFile imageFile){
    	
    	ObjectMapper objectMapper = new ObjectMapper();
    	RegisterUserDto dto;
    	try {
			dto = objectMapper.readValue(user,RegisterUserDto.class);
		} catch (JsonProcessingException e) {
			throw new ApiException("Invalid user json format!");
		}
    	
    	try {
    		ApiResponse response = userService.addNewUser(dto, imageFile);
    		return new ResponseEntity<>(response,HttpStatus.CREATED);
    	}catch(Exception e) {
    		return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }

    
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getUserImage(@PathVariable Long id){
    	 byte[] responseImage = userService.getUserImage(id);
    	 return ResponseEntity.ok().contentType(MediaType.valueOf(userService.getImageType(id))).body(responseImage);
    } 
    
    @GetMapping("/image")
    public ResponseEntity<byte[]> getUserImageWithToken(){
    	Long id = userService.getUserByJwt().getId();
    	 byte[] responseImage = userService.getUserImage(id);
    	 return ResponseEntity.ok().contentType(MediaType.valueOf(userService.getImageType(id))).body(responseImage);
    } 
    
    
    
    //Login API for users
    @PostMapping("/signin")
	public ResponseEntity<?> userSignIn(@RequestBody @Valid
			AuthorizationRequest dto) {
		UsernamePasswordAuthenticationToken 
		authenticationToken = new UsernamePasswordAuthenticationToken
		(dto.getEmail(),dto.getPassword());
		System.out.println(authenticationToken.isAuthenticated());
		Authentication authToken = authenticationManager.authenticate(authenticationToken);
		System.out.println(authToken.isAuthenticated());
		return ResponseEntity.status(HttpStatus.CREATED).body(new AuthorizationResponse("Successful Authenticated !", jwtUtils.generateJwtToken(authToken)));			
	}

    
    
    
    
    //update API for users
    @PutMapping("/update-profile")
    public ResponseEntity<ApiResponse> updateProfile(@RequestBody UpdateProfileDto updateProfileDto) {
        return ResponseEntity.ok(userService.updateProfile(updateProfileDto));
    }

    
    
    
    
    
    //change password API for users
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody ChangePasswordDto changePasswordDto) {
        return ResponseEntity.ok(userService.changePassword(changePasswordDto));
    }
    
    
    
    
    
    
    //list all users API for ADMIN
    @GetMapping("/list")
	public ResponseEntity<?> getAllUsersPaginated(
			@RequestParam(defaultValue = "0", required = false) int pageNumber,
			@RequestParam(defaultValue = "2", required = false) int pageSize) {
		System.out.println("in get all users " + pageNumber + " " + pageSize);
		List<UserListDto> list = userService.getAllUsers(pageNumber, pageSize);
		if (list.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		return ResponseEntity.ok(list);
	}

    
    
    
    
    
    //get one user for ADMIN
    @GetMapping("getUser/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }
    
    
    
    
    
    //required to update profile
    @GetMapping("/get-user")
    public ResponseEntity<UserResponseDto> getUserById(){
    	return ResponseEntity.ok(userService.getUserByJwt());
    }
    
    
    
    
    
    //list of user based on farming type for ADMIN
    @GetMapping("/farming-type/{type}")
    public ResponseEntity<?> getUsersByFarmingType(@PathVariable FarmingType type,
    		@RequestParam(defaultValue = "0", required = false) int pageNumber,
			@RequestParam(defaultValue = "2", required = false) int pageSize) {
    	System.out.println("in get all users " + pageNumber + " " + pageSize);
		List<UserListDto> list = userService.getUsersByFarmingType(type, pageNumber, pageSize);
		if (list.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		return ResponseEntity.ok(list);
    }

    
    
    
    
    //access all users by ADMIN
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable UserRole role,
    		@RequestParam(defaultValue = "0", required = false) int pageNumber,
			@RequestParam(defaultValue = "2", required = false) int pageSize) {
    	System.out.println("in get all users " + pageNumber + " " + pageSize);
		List<UserListDto> list = userService.getUsersByRole(role, pageNumber, pageSize);
		if (list.isEmpty())
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		return ResponseEntity.ok(list);
    }

    
    
    //delete user by Administrator
    @DeleteMapping("delete/{userId}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.deleteUser(userId));
    }


}
