package com.projektr.codeblaze.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "https://codeblazefe.onrender.com",
                                "http://localhost:3000" // Add any other origins you need
                        )
                        .allowedMethods("*") // You can specify methods like "GET", "POST", etc.
                        .allowedHeaders("*") // Allows all headers
                        .allowCredentials(true); // Set this based on your requirements
            }
        };
    }
}
