package com.kisan.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.kisan.custom_exceptions.ResourceNotFoundException;
import com.kisan.dao.UserDao;
import com.kisan.pojo.UserEntity;

@Component
public class SecurityUtils {

    @Autowired
    private UserDao userDao;

    public UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getCredentials() == null) {
            throw new AccessDeniedException("User is not authenticated");
        }
        Long userId = (Long) authentication.getCredentials();
        return userDao.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
