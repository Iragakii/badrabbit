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

    @GetMapping("/chart/{id}")
    public ResponseEntity<?> getChart(@PathVariable String id) {
        try {
            long now = System.currentTimeMillis();
            // Serve cached data if it's less than 2 minutes old
            if (cache.containsKey(id) && now - lastFetch.get(id) < 120_000) {
                return ResponseEntity.ok(cache.get(id));
            }

            String url = "https://api.coingecko.com/api/v3/coins/" + id +
                    "/market_chart?vs_currency=usd&days=1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0")
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // handle rate limit
            if (response.statusCode() == 429) {
                System.err.println("CoinGecko 429 rate limit for " + id);
                if (cache.containsKey(id)) {
                    return ResponseEntity.ok(cache.get(id));
                }
                return ResponseEntity.status(429).body(Map.of("error", "Rate limit exceeded"));
            }

            if (response.statusCode() != 200) {
                System.err.println("CoinGecko error " + response.statusCode() + " for " + id);
                return ResponseEntity.status(response.statusCode()).body(Map.of("error", "API error"));
            }

            Map<String, Object> body = mapper.readValue(response.body(), new TypeReference<>() {});
            if (body.containsKey("error")) {
                if (cache.containsKey(id)) {
                    return ResponseEntity.ok(cache.get(id));
                }
                return ResponseEntity.status(500).body(Map.of("error", body.get("error")));
            }

            cache.put(id, body);
            lastFetch.put(id, now);

            return ResponseEntity.ok(body);
        } catch (Exception e) {
            e.printStackTrace();
            if (cache.containsKey(id)) {
                return ResponseEntity.ok(cache.get(id));
            }
            return ResponseEntity.status(500).body(Map.of("error", "Error fetching chart"));
        }
    }
}
