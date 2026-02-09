package com.fyp.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ragService {
    @Autowired
    private final WebClient webClient;

    public String check_health() {
        return webClient.get()
                .uri("/health")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String sendDataToRender(Object data) {
        return webClient.post()
                .uri("/ask")
                .bodyValue(data)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
