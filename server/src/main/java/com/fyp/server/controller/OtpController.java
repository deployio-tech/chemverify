package com.fyp.server.controller;

import com.fyp.server.dto.OtpRequestDTO;
import com.fyp.server.dto.OtpVerifyDTO;
import com.fyp.server.dto.ResetPasswordDTO;
import com.fyp.server.entity.User;
import com.fyp.server.repository.UserRepository;
import com.fyp.server.service.EmailService;
import com.fyp.server.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * POST /api/auth/otp/send
     * Send an OTP to the user's email.
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody OtpRequestDTO request) {
        String email = request.getEmail();
        String purpose = request.getPurpose() != null ? request.getPurpose() : "LOGIN_VERIFY";

        // For forgot password, verify the email exists
        if ("FORGOT_PASSWORD".equals(purpose)) {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isEmpty()) {
                // Return success anyway to prevent email enumeration
                return ResponseEntity.ok(Map.of("message", "If the email exists, an OTP has been sent."));
            }
        }

        String otp = otpService.generateOtp(email, purpose);
        emailService.sendOtpEmail(email, otp, purpose);

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully."));
    }

    /**
     * POST /api/auth/otp/verify
     * Verify the OTP entered by the user.
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody OtpVerifyDTO request) {
        String purpose = request.getPurpose() != null ? request.getPurpose() : "LOGIN_VERIFY";

        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp(), purpose);

        if (valid) {
            return ResponseEntity.ok(Map.of("verified", true, "message", "OTP verified successfully."));
        } else {
            return ResponseEntity.badRequest().body(
                    Map.of("verified", false, "message", "Invalid or expired OTP. Please try again.")
            );
        }
    }

    /**
     * POST /api/auth/otp/reset-password
     * Reset the password after OTP verification.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordDTO request) {
        String purpose = "FORGOT_PASSWORD";

        // Verify OTP first
        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp(), purpose);
        if (!valid) {
            // Also check if already verified
            if (!otpService.isVerified(request.getEmail(), purpose)) {
                return ResponseEntity.badRequest().body(
                        Map.of("message", "Invalid or expired OTP. Please request a new one.")
                );
            }
        }

        // Find user
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found."));
        }

        // Reset password
        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Consume the OTP
        otpService.consumeOtp(request.getEmail(), purpose);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
    }
}
