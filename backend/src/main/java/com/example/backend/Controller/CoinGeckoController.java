package com.example.backend.Controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/price")
public class CoinGeckoController {

    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, Object> cache = new HashMap<>();
    private final Map<String, Long> lastFetch = new HashMap<>();
    private final Map<String, String> imageCache = new HashMap<>();
    private long lastRequestTime = 0;
    private static final long MIN_REQUEST_INTERVAL = 1200; // 1.2 seconds between requests to avoid rate limit

    @GetMapping("/chart/{id}")
    public ResponseEntity<?> getChart(@PathVariable String id) {
        try {
            long now = System.currentTimeMillis();
            // Serve cached data if it's less than 5 minutes old (increased cache time)
            if (cache.containsKey(id) && now - lastFetch.get(id) < 300_000) {
                @SuppressWarnings("unchecked")
                Map<String, Object> cachedData = (Map<String, Object>) cache.get(id);
                // Add image URL to cached response
                if (imageCache.containsKey(id)) {
                    cachedData.put("image", imageCache.get(id));
                }
                return ResponseEntity.ok(cachedData);
            }

            // Rate limiting: wait if last request was too recent
            long timeSinceLastRequest = now - lastRequestTime;
            if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
                try {
                    Thread.sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            lastRequestTime = System.currentTimeMillis();

            // Fetch chart data
            String chartUrl = "https://api.coingecko.com/api/v3/coins/" + id +
                    "/market_chart?vs_currency=usd&days=1";

            HttpRequest chartRequest = HttpRequest.newBuilder()
                    .uri(URI.create(chartUrl))
                    .header("User-Agent", "Mozilla/5.0")
                    .build();

            HttpResponse<String> chartResponse = client.send(chartRequest, HttpResponse.BodyHandlers.ofString());

            // handle rate limit
            if (chartResponse.statusCode() == 429) {
                System.err.println("CoinGecko 429 rate limit for " + id);
                if (cache.containsKey(id)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> cachedData = (Map<String, Object>) cache.get(id);
                    if (imageCache.containsKey(id)) {
                        cachedData.put("image", imageCache.get(id));
                    }
                    return ResponseEntity.ok(cachedData);
                }
                return ResponseEntity.status(429).body(Map.of("error", "Rate limit exceeded"));
            }

            if (chartResponse.statusCode() != 200) {
                System.err.println("CoinGecko error " + chartResponse.statusCode() + " for " + id);
                if (cache.containsKey(id)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> cachedData = (Map<String, Object>) cache.get(id);
                    if (imageCache.containsKey(id)) {
                        cachedData.put("image", imageCache.get(id));
                    }
                    return ResponseEntity.ok(cachedData);
                }
                return ResponseEntity.status(chartResponse.statusCode()).body(Map.of("error", "API error"));
            }

            Map<String, Object> body = mapper.readValue(chartResponse.body(), new TypeReference<>() {});
            if (body.containsKey("error")) {
                if (cache.containsKey(id)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> cachedData = (Map<String, Object>) cache.get(id);
                    if (imageCache.containsKey(id)) {
                        cachedData.put("image", imageCache.get(id));
                    }
                    return ResponseEntity.ok(cachedData);
                }
                return ResponseEntity.status(500).body(Map.of("error", body.get("error")));
            }

            // Fetch image URL if not cached (only fetch once per token)
            if (!imageCache.containsKey(id)) {
                try {
                    Thread.sleep(500); // Small delay before image request
                    String imageUrl = "https://api.coingecko.com/api/v3/coins/" + id;
                    HttpRequest imageRequest = HttpRequest.newBuilder()
                            .uri(URI.create(imageUrl))
                            .header("User-Agent", "Mozilla/5.0")
                            .build();
                    HttpResponse<String> imageResponse = client.send(imageRequest, HttpResponse.BodyHandlers.ofString());
                    if (imageResponse.statusCode() == 200) {
                        Map<String, Object> imageData = mapper.readValue(imageResponse.body(), new TypeReference<>() {});
                        if (imageData.containsKey("image")) {
                            @SuppressWarnings("unchecked")
                            Map<String, String> imageObj = (Map<String, String>) imageData.get("image");
                            if (imageObj != null && imageObj.containsKey("small")) {
                                imageCache.put(id, imageObj.get("small"));
                                body.put("image", imageObj.get("small"));
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error fetching image for " + id + ": " + e.getMessage());
                    // Continue without image
                }
            } else {
                body.put("image", imageCache.get(id));
            }

            cache.put(id, body);
            lastFetch.put(id, System.currentTimeMillis());

            return ResponseEntity.ok(body);
        } catch (Exception e) {
            e.printStackTrace();
            if (cache.containsKey(id)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> cachedData = (Map<String, Object>) cache.get(id);
                if (imageCache.containsKey(id)) {
                    cachedData.put("image", imageCache.get(id));
                }
                return ResponseEntity.ok(cachedData);
            }
            return ResponseEntity.status(500).body(Map.of("error", "Error fetching chart"));
        }
    }
}
