package com.fyp.server.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_VALIDITY_SECONDS = 300; // 5 minutes
    private static final int MAX_ATTEMPTS = 5;
    private final SecureRandom secureRandom = new SecureRandom();

    // In-memory store: key = email:purpose, value = OtpEntry
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private record OtpEntry(String otp, Instant expiresAt, int attempts, boolean verified) {
        OtpEntry withAttempt() {
            return new OtpEntry(otp, expiresAt, attempts + 1, verified);
        }
        OtpEntry asVerified() {
            return new OtpEntry(otp, expiresAt, attempts, true);
        }
    }

    /**
     * Generate a 6-digit OTP for the given email + purpose.
     */
    public String generateOtp(String email, String purpose) {
        String key = buildKey(email, purpose);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(secureRandom.nextInt(10));
        }
        String otp = sb.toString();
        Instant expiresAt = Instant.now().plusSeconds(OTP_VALIDITY_SECONDS);
        otpStore.put(key, new OtpEntry(otp, expiresAt, 0, false));
        return otp;
    }

    /**
     * Verify the given OTP.
     * Returns true if valid, false otherwise.
     */
    public boolean verifyOtp(String email, String otp, String purpose) {
        String key = buildKey(email, purpose);
        OtpEntry entry = otpStore.get(key);

        if (entry == null) {
            return false;
        }

        // Check if expired
        if (Instant.now().isAfter(entry.expiresAt())) {
            otpStore.remove(key);
            return false;
        }

        // Check max attempts
        if (entry.attempts() >= MAX_ATTEMPTS) {
            otpStore.remove(key);
            return false;
        }

        // Increment attempt
        otpStore.put(key, entry.withAttempt());

        if (entry.otp().equals(otp)) {
            // Mark as verified
            otpStore.put(key, entry.asVerified());
            return true;
        }

        return false;
    }

    /**
     * Check if the OTP for a given email + purpose was verified.
     */
    public boolean isVerified(String email, String purpose) {
        String key = buildKey(email, purpose);
        OtpEntry entry = otpStore.get(key);
        return entry != null && entry.verified();
    }

    /**
     * Consume the OTP entry after successful use (e.g., after password reset).
     */
    public void consumeOtp(String email, String purpose) {
        otpStore.remove(buildKey(email, purpose));
    }

    private String buildKey(String email, String purpose) {
        return email.toLowerCase() + ":" + purpose;
    }
}
