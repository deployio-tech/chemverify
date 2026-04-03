package com.fyp.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;

import com.fyp.server.dto.RecommendationRequestDTO;
import com.fyp.server.dto.RecommendationResponseDTO;
import com.fyp.server.entity.RecommendationEntity;
import com.fyp.server.repository.RecommendationRepository;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final WebClient webClient;

    public ResponseEntity<?> getRecommendation(RecommendationRequestDTO requestDTO) {
        try {
            // 1. Call Python/Flask AI Backend using the pre-configured WebClient
            // Flask returns { "response": { ...formulation... } } — parse the wrapper as Map first
            Map body = webClient.post()
                    .uri("/recommend")
                    .bodyValue(requestDTO)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (body != null && body.containsKey("response")) {
                // 2. Deserialize the inner "response" key into the typed DTO using Jackson
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                RecommendationResponseDTO typedResponse = mapper.convertValue(
                        body.get("response"), RecommendationResponseDTO.class
                );

                // 3. Save the typed response to MongoDB
                RecommendationEntity recommendationEntity = RecommendationEntity.builder()
                        .skinType(requestDTO.getSkinType())
                        .skinCondition(requestDTO.getSkinCondition())
                        .skinColor(requestDTO.getSkinColor())
                        .weather(requestDTO.getWeather())
                        .productType(requestDTO.getProductType())
                        .recommendationData(typedResponse)
                        .createdAt(LocalDateTime.now())
                        .build();

                recommendationRepository.save(recommendationEntity);

                // 4. Return the full original response to the frontend
                return ResponseEntity.ok(typedResponse);
            } else {
                return ResponseEntity.status(500).body("Error retrieving AI recommendation from model: Empty response");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}
