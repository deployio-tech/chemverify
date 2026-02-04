package com.fyp.server.controller;

import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.dto.loginRequestDTO;
import com.fyp.server.dto.loginResponseDTO;
import com.fyp.server.entity.User;
import com.fyp.server.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignUpRequestDTO signupRequest) {
        User user = authService.signUpInternal(signupRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<loginResponseDTO> login(@RequestBody loginRequestDTO loginRequest) {
        loginResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
