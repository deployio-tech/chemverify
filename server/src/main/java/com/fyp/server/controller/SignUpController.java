package com.fyp.server.controller;

import com.fyp.server.dto.OtpVerifyDTO;
import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.dto.UserProfileDTO;
import com.fyp.server.entity.User;
import com.fyp.server.service.SignUpService;
import com.fyp.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class SignUpController {
    private final UserService userService;
    private final SignUpService signUpService;


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
    public ResponseEntity<?> createUser(@RequestBody SignUpRequestDTO req) {
        try {
            User created = signUpService.signup(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of("message", "User created. Please verify OTP.", "email", created.getEmail())
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifySignupOtp(@RequestBody OtpVerifyDTO request) {
        try {
            // The unsaved user is looked up and saved after OTP verification
            User savedUser = signUpService.verifyOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok(Map.of("message", "Account verified and created successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
