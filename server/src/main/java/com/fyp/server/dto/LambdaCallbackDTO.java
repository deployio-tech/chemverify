package com.fyp.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LambdaCallbackDTO {
    private String id;
    private String status;
    private String extractedText;
}
