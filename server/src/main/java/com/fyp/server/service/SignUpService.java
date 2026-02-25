package com.fyp.server.service;

import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.dto.loginRequestDTO;
import com.fyp.server.dto.loginResponseDTO;
import com.fyp.server.entity.User;
import com.fyp.server.repository.UserRepository;
import com.fyp.server.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SignUpService {

    private final AuthService authService;
    private final UserService userService;
    private final OtpService otpService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    // Temporarily store unsaved users keyed by email until OTP is verified
    private final Map<String, User> pendingUsers = new ConcurrentHashMap<>();

    public User signup(SignUpRequestDTO signupRequest) {
        User user = userService.createUser(signupRequest);
        // Store in memory until OTP is verified
        pendingUsers.put(user.getEmail(), user);

        // Generate and send OTP
        String otp = otpService.generateOtp(user.getEmail(), "LOGIN_VERIFY");
        emailService.sendOtpEmail(user.getEmail(), otp, "LOGIN_VERIFY");

        return user;
    }

    public User verifyOtp(String email, String otp) {
        boolean isOTPCorrect = otpService.verifyOtp(email, otp, "LOGIN_VERIFY");

        if (isOTPCorrect) {
            otpService.consumeOtp(email, "LOGIN_VERIFY");

            // Get the pending user and save to DB
            User unsavedUser = pendingUsers.remove(email);
            if (unsavedUser != null) {
                return userService.saveUser(unsavedUser);
            }
            throw new IllegalArgumentException("No pending signup found for this email. Please sign up again.");
        }
        throw new IllegalArgumentException("Invalid OTP");
    }

    public loginResponseDTO login(loginRequestDTO loginRequest) {
        return authService.login(loginRequest);
    }
}
