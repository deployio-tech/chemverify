package com.fyp.server.dto;

import lombok.Data;

@Data
public class RecommendationRequestDTO {
    private String skinType;
    private String skinCondition;
    private String skinColor;
    private String weather;
    private String productType;
}
