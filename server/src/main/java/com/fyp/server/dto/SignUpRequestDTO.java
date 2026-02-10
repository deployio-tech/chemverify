package com.fyp.server.dto;

import com.fyp.server.entity.UserRole;
import lombok.*;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequestDTO {

    private String name;
    private String email;
    private String password;
    private Set<UserRole> role;
}
