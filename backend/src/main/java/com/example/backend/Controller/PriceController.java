package com.example.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;

@RestController
@RequestMapping("/api/price")
public class PriceController {
@GetMapping("/{symbol}")
public ResponseEntity<?> getPrice(@PathVariable String symbol) {
    try {
        String symbolUpper = symbol.toUpperCase() + "USDT";
        String apiUrl = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbolUpper;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("User-Agent", "Mozilla/5.0")
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> data = mapper.readValue(response.body(), new TypeReference<>() {});
        Double usd = Double.parseDouble((String) data.get("price"));

        return ResponseEntity.ok(Map.of("symbol", symbolUpper, "price", usd));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error fetching price for " + symbol);
    }
}
}
