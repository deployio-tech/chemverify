package com.fyp.server.dto;

import com.fyp.server.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDTO {
    private String id;
    private String name;
    private String email;
    private Set<UserRole> roles;
}
