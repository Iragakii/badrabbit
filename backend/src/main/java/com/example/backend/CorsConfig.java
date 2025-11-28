package com.example.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Build list of allowed origin patterns
        List<String> allowedPatterns = new ArrayList<>();
        
        // Add frontend URL from config (convert to pattern if needed)
        if (frontendUrl != null && !frontendUrl.isEmpty()) {
            // If it's already a full URL, add it as pattern
            allowedPatterns.add(frontendUrl);
        }
        
        // Add specific Render URLs
        allowedPatterns.add("https://badrabbit-iragaki-nft.onrender.com");
        allowedPatterns.add("http://localhost:5173");
        allowedPatterns.add("http://localhost:4173");
        
        // Add wildcard patterns for Render and localhost
        allowedPatterns.add("https://*.onrender.com"); // Allow all Render subdomains
        allowedPatterns.add("http://localhost:*"); // Allow localhost on any port
        
        // Use allowedOriginPatterns (Spring Boot 2.4+) - supports both specific origins and wildcards
        registry.addMapping("/**")
                .allowedOriginPatterns(allowedPatterns.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Cache preflight requests for 1 hour
    }
}
