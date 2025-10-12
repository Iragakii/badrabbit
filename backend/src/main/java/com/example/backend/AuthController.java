package com.example.backend;

import com.example.backend.utils.SignatureUtils;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final Map<String, String> pendingMessages = new ConcurrentHashMap<>();

    @GetMapping("/message")
    public Map<String, String> getMessage(@RequestParam String address) {
        String nonce = UUID.randomUUID().toString();
        String message = "Login to MyApp with wallet " + address + "\nNonce: " + nonce;
        pendingMessages.put(address.toLowerCase(), message);
        return Map.of("message", message);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifySignature(@RequestBody Map<String, String> payload, HttpServletResponse response) {
        String address = payload.get("address").toLowerCase();
        String signature = payload.get("signature");

        String message = pendingMessages.get(address);
        if (message == null) {
            return ResponseEntity.status(400).body(Map.of("error", "No message pending for this address"));
        }

        // Verify real Ethereum signature using Web3j
        boolean valid = SignatureUtils.verify(address, message, signature);

        if (!valid) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid signature"));
        }

        // Create JWT token
        String token = Jwts.builder()
                .setSubject(address)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(SECRET_KEY)
                .compact();

        // Save token in cookie
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true if HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);

        pendingMessages.remove(address);

        return ResponseEntity.ok(Map.of("message", "Login success", "token", token));
    }
}
