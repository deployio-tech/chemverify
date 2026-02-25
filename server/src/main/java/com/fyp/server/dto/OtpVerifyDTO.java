package com.fyp.server.dto;

import lombok.Data;

@Data
public class OtpVerifyDTO {
    private String email;
    private String otp;
    private String purpose;
}
