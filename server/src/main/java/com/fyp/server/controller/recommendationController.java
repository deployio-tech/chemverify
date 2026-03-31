package com.fyp.server.controller;

import com.fyp.server.dto.RecommendationRequestDTO;
import com.fyp.server.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class recommendationController {

    private final RecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<?> getRecommendation(@RequestBody RecommendationRequestDTO recommendationRequestDTO) {
        return recommendationService.getRecommendation(recommendationRequestDTO);
    }

}
