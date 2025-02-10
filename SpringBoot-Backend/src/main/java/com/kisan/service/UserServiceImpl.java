package com.kisan.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kisan.custom_exceptions.ApiException;
import com.kisan.custom_exceptions.ResourceNotFoundException;
import com.kisan.dao.UserDao;
import com.kisan.dto.*;
import com.kisan.pojo.FarmingType;
import com.kisan.pojo.UserEntity;
import com.kisan.pojo.UserRole;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserDao userDao;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    //private final ImageHandlingService imageHandlingService;

    public UserServiceImpl(	UserDao userDao, 
    						ModelMapper modelMapper, 
    						PasswordEncoder passwordEncoder 
    						//, ImageHandlingService imageHandlingService
    						) {
        this.userDao = userDao;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
       // this.imageHandlingService = imageHandlingService;
    }


    @Override
	public ApiResponse addNewUser(RegisterUserDto dto, MultipartFile imageFile) throws IOException {
		 if (userDao.existsByEmail(dto.getEmail())) {
	            throw new ApiException("User email already exists!");
	        }

	        UserEntity user = new UserEntity();
	        user.setFirstName(dto.getFirstName());
	        user.setLastName(dto.getLastName());
	        user.setEmail(dto.getEmail());
	        user.setPassword(passwordEncoder.encode(dto.getPassword()));
	        user.setMobile(dto.getMobile());
	        user.setFarmingType(dto.getFarmingType());
	        user.setAdrLine1(dto.getAdrLine1());
	        user.setAdrLine2(dto.getAdrLine2());
	        user.setCity(dto.getCity());
	        user.setGender(dto.getGender());
	        user.setState(dto.getState());
	        user.setZipCode(dto.getZipCode());
	        user.setRole(dto.getRole());
	        user.setStatus(true);
	        user.setImageName(imageFile.getName());
	        user.setImageType(imageFile.getContentType());
	        user.setProfileImage(imageFile.getBytes());
		
		UserEntity savedUser =  userDao.save(user);
		return new ApiResponse("User registered with ID " + savedUser.getId());
	}
    
    @Override
    public byte[] getUserImage(Long id) {
    	UserEntity user = userDao.findById(id).orElseThrow();
    	return user.getProfileImage();
    }
    
    @Override
    public String getImageType(Long id) {
    	UserEntity user = userDao.findById(id).orElseThrow();
    	return user.getImageType();
    }

    
    
//----------------------------------------------------Previous Register implementation to be reviewed
//    @Override
//    public ApiResponse registerNewUser(UserDto dto, MultipartFile image) {
//        if (userDao.existsByEmail(dto.getEmail())) {
//            throw new ApiException("User email already exists!");
//        }
//
//        UserEntity user = new UserEntity();
//        user.setFirstName(dto.getFirstName());
//        user.setLastName(dto.getLastName());
//        user.setEmail(dto.getEmail());
//        user.setPassword(passwordEncoder.encode(dto.getPassword()));
//        user.setMobile(dto.getMobile());
//        user.setFarmingType(dto.getFarmingType());
//        user.setAdrLine1(dto.getAdrLine1());
//        user.setAdrLine2(dto.getAdrLine2());
//        user.setCity(dto.getCity());
//        user.setGender(dto.getGender());
//        user.setState(dto.getState());
//        user.setZipCode(dto.getZipCode());
//        user.setRole(dto.getRole());
//        user.setStatus(true);
//
//        UserEntity savedUser = userDao.save(user);
//
//        if (image != null && !image.isEmpty()) {
//            try {
//                String imageUrl = imageHandlingService.uploadImage(image);
////                savedUser.setProfileImage(imageUrl);
//                userDao.save(savedUser); 
//            } catch (IOException e) {
//            	userDao.delete(savedUser);
//            	throw new ApiException("Image upload failed: " + e.getMessage());
//
//            }
//        }
//
//        return new ApiResponse("User registered with ID " + savedUser.getId());
//    }

    
    

    @Override
    public ApiResponse updateProfile(UpdateProfileDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserEntity user = userDao.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        modelMapper.map(dto, user);
        userDao.save(user);
        return new ApiResponse("Profile updated successfully");
    }
 
    
    
    @Override
    public ApiResponse changePassword(ChangePasswordDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserEntity user = userDao.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new ApiException("Incorrect old password");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userDao.save(user);
        return new ApiResponse("Password changed successfully");
    }
    
    
    
    
    @Override
	public List<UserListDto> getAllUsers(int pageNumber, int pageSize) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		List<UserEntity> users = userDao.findAll(pageable).getContent();
		return users.stream().map(user -> 
				modelMapper.map(user, UserListDto.class)).collect(Collectors.toList());
	}
    
    
    
    
    
    
    @Override
    public UserDto getUserById(Long userId) {
        UserEntity user = userDao.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return modelMapper.map(user, UserDto.class);
    }

    
    
    
    
    @Override
    public List<UserListDto> getUsersByFarmingType(FarmingType type, int pageNumber, int pageSize) {
        return userDao.findByFarmingType(type).stream().map(user -> modelMapper.map(user, UserListDto.class)).collect(Collectors.toList());
    }

    
    
    
    @Override
    public List<UserListDto> getUsersByRole(UserRole role, int pageNumber, int pageSize) {
        return userDao.findByRole(role).stream().map(user -> modelMapper.map(user, UserListDto.class)).collect(Collectors.toList());
    }

    
    
    
    
    
    @Override
    public ApiResponse deleteUser(Long userId) {
        UserEntity user = userDao.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(false);
        userDao.save(user);
        return new ApiResponse("User soft deleted successfully");
    }

    
    
    
    
    
    
    
	@Override
	public UserResponseDto getUserByJwt() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();
		UserEntity user = userDao.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("user not found"));
		return modelMapper.map(user, UserResponseDto.class);
	}


}
