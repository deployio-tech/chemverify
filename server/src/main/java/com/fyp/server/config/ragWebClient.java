package com.fyp.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class ragWebClient {

    @Value("${render.api.base-url}")
    private String renderBaseUrl;

    @Bean
    public WebClient webClient() {
        return WebClient.builder().baseUrl(renderBaseUrl).build();
    }

}
