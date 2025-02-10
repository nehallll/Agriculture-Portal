package com.kisan.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kisan.dto.ApiResponse;
import com.kisan.dto.ChangePasswordDto;
import com.kisan.dto.RegisterUserDto;
import com.kisan.dto.UpdateProfileDto;
import com.kisan.dto.UserDto;
import com.kisan.dto.UserListDto;
import com.kisan.dto.UserResponseDto;
import com.kisan.pojo.FarmingType;
import com.kisan.pojo.UserEntity;
import com.kisan.pojo.UserRole;

public interface UserService {

	ApiResponse deleteUser(Long userId);

	//ApiResponse uploadImage(MultipartFile image);

	//MultipartFile getImage(Long userId);

	List<UserListDto> getUsersByRole(UserRole role, int pageNumber, int pageSize);

	List<UserListDto> getUsersByFarmingType(FarmingType type, int pageNumber, int pageSize);

	UserDto getUserById(Long userId);

	List<UserListDto> getAllUsers(int pageNumber, int pageSize);

	ApiResponse changePassword(ChangePasswordDto dto);

	ApiResponse updateProfile(UpdateProfileDto dto);

//	ApiResponse registerNewUser(UserDto dto, MultipartFile image);

	UserResponseDto getUserByJwt();

	ApiResponse addNewUser(RegisterUserDto user, MultipartFile imageFile) throws IOException;
	
	byte[] getUserImage(Long id);
	
	String getImageType(Long id);

	
}