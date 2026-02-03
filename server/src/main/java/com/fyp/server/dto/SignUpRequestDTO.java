package com.fyp.server.dto;

import lombok.*;

@Data
public class SignUpRequestDTO {

    private String name;
    private String email;
    private String password;
    private String role;
}
