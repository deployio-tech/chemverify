package com.fyp.server.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;


    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Send an OTP email to the user.
     */
    public void sendOtpEmail(String toEmail, String otp, String purpose) {
        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setTo(toEmail);
//            message.setSubject(getSubject(purpose));
//            message.setText(getBody(otp, purpose));
//            message.setFrom(fromEmail);
//            mailSender.send(message);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your Verification Code - SkinExpert");
            helper.setText(getBody(otp, purpose), true); // TRUE = HTML
            mailSender.send(message);

            log.info("OTP email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            // Don't throw — we still return success to avoid email enumeration
        }
    }

    private String getSubject(String purpose) {
        return switch (purpose) {
            case "FORGOT_PASSWORD" -> "SkinExpert — Password Reset Code";
            default -> "SkinExpert — Login Verification Code";
        };
    }

    private String getBody(String otp, String purpose) {

        String action = purpose.equals("FORGOT_PASSWORD")
                ? "reset your password"
                : "verify your login";

        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;">
        
            <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                <tr>
                    <td align="center">
                        <table width="480px" cellpadding="0" cellspacing="0"
                               style="background:#ffffff; padding:40px; border-radius:12px; 
                                      box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                            
                            <tr>
                                <td align="center" style="padding-bottom:20px;">
                                    <h2 style="margin:0; color:#2c3e50;">SkinExpert</h2>
                                    <p style="margin:5px 0 0; font-size:14px; color:#7f8c8d;">
                                        Secure Account Verification
                                    </p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding:20px 0; font-size:15px; color:#34495e; line-height:1.6;">
                                    Hello,
                                    <br><br>
                                    We received a request to <strong>%s</strong>.
                                    Please use the verification code below:
                                </td>
                            </tr>
                            
                            <tr>
                                <td align="center" style="padding:20px 0;">
                                    <div style="
                                        display:inline-block;
                                        padding:14px 28px;
                                        font-size:26px;
                                        letter-spacing:6px;
                                        font-weight:bold;
                                        color:#2c3e50;
                                        background:#ecf0f1;
                                        border-radius:8px;">
                                        %s
                                    </div>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="font-size:14px; color:#7f8c8d; line-height:1.6;">
                                    This code is valid for <strong>5 minutes</strong>.
                                    For security reasons, please do not share this code with anyone.
                                    <br><br>
                                    If you did not initiate this request, you can safely ignore this email.
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding-top:30px; font-size:12px; color:#95a5a6;" align="center">
                                    © 2026 SkinExpert. All rights reserved.
                                </td>
                            </tr>
                        
                        </table>
                        
                    </td>
                </tr>
            </table>
        
        </body>
        </html>
        """.formatted(action, otp);
    }

}
