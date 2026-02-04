package com.fyp.server.service;

import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.dto.loginRequestDTO;
import com.fyp.server.dto.loginResponseDTO;
import com.fyp.server.entity.User;
import com.fyp.server.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthService authService;

    public User signup(SignUpRequestDTO signupRequest) {
        return authService.signUpInternal(signupRequest);
    }

    public loginResponseDTO login(loginRequestDTO loginRequest) {
        return authService.login(loginRequest);
    }
}
