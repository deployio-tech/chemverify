package com.fyp.server.dto;

import lombok.Data;

@Data
public class OtpRequestDTO {
    private String email;
    private String purpose; // "LOGIN_VERIFY" or "FORGOT_PASSWORD"
}
