package com.example.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Use allowedOriginPatterns which supports wildcards (Spring Boot 2.4+)
        // This is safer and more flexible than allowedOrigins
        registry.addMapping("/**")
                .allowedOriginPatterns(
                    "https://*.onrender.com",  // All Render subdomains
                    "http://localhost:*",      // Localhost on any port
                    frontendUrl                // Frontend URL from config
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
