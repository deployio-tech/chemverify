package com.fyp.server.controller;

import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.dto.UserProfileDTO;
import com.fyp.server.entity.User;
import com.fyp.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        UserProfileDTO profile = UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();

        return ResponseEntity.ok(profile);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody SignUpRequestDTO req) {
        User created = userService.createUser(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
