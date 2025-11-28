package com.example.backend.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Value("${morali.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/{address}/erc20")
    public ResponseEntity<Object> getERC20Tokens(@PathVariable String address) {
        String url = "https://deep-index.moralis.io/api/v2.2/" + address + "/erc20?chain=eth";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
        return response;
    }

    @GetMapping("/{address}/balance")
    public ResponseEntity<Object> getBalance(@PathVariable String address) {
        String url = "https://deep-index.moralis.io/api/v2.2/" + address + "/balance?chain=eth";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
        return response;
    }

    @GetMapping("/{address}/weth-balance")
    public ResponseEntity<Map<String, Object>> getWETHBalance(@PathVariable String address) {
        // Mock WETH balance for testing - return 0 WETH
        // In production, this would query the blockchain or user account
        return ResponseEntity.ok(Map.of(
            "balance", 0.0,
            "currency", "WETH",
            "address", address.toLowerCase()
        ));
    }
}
