package com.fyp.server.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ragService {

    private final WebClient webClient;

    public String getUsers() {
        return webClient.get()
                .uri("/health")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String sendDataToRender(Object data) {
        return webClient.post()
                .uri("/api/data")
                .bodyValue(data)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
