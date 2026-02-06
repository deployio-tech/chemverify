package com.fyp.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ragService {

    private final WebClient webClient;

    @Value("${render.api.base-url}")
    private String baseUrl;

    public ragService(WebClient webClient) {
        this.webClient = webClient;
    }
    public String getUsers() {
        return webClient.get()
                .uri(baseUrl + "/health")
                .retrieve()
                .bodyToMono(String.class)
                .block(); // blocks and waits for response
    }

    public String sendDataToRender(Object data) {
        return webClient.post()
                .uri(baseUrl + "/api/data")
                .bodyValue(data)
                .retrieve()
                .bodyToMono(String.class)
                .block(); // blocks and waits for response
    }
}
