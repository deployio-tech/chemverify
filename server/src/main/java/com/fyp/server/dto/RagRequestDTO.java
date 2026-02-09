package com.fyp.server.dto;

import com.fyp.server.entity.UserRole;
import lombok.Data;

@Data
public class RagRequestDTO {
    public String jwtToken;
    public String Id;
    public String role;

}
