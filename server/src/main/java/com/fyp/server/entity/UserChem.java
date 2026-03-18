package com.fyp.server.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "user_chems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserChem {
    @Id
    private String id;
    private String userId;
    private String s3Key;
    private String imageUrl;
    private List<String> ingredients;
    private SkinType skinType;
    private AnalysisStatus status;
    private String extractedText;
    private String ragResponse;

    @CreatedDate
    private Instant createdAt;
}
