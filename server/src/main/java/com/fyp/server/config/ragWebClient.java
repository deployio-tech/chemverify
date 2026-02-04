package com.fyp.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ragWebClient {
    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }

}
