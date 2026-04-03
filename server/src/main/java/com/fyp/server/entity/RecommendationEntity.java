package com.fyp.server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fyp.server.dto.RecommendationResponseDTO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationEntity {
    @Id
    private String id;
    
    // Request parameters
    private String skinType;
    private String skinCondition;
    private String skinColor;
    private String weather;
    private String productType;
    
    // Typed formulation response from the AI
    private RecommendationResponseDTO recommendationData;
    
    private java.time.LocalDateTime createdAt;
}
