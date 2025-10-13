package com.example.backend.Controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.SignatureUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

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
        cookie.setHttpOnly(false);
        cookie.setSecure(false); // true if HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);

        // Create or update user in DB
        Optional<User> existingUser = userRepository.findByWalletAddress(address);
        if (existingUser.isEmpty()) {
            User newUser = new User();
            newUser.setWalletAddress(address);
            newUser.setUsername(""); // default empty
            newUser.setBio("");
            newUser.setWebsite("");
            newUser.setProfileImageUrl(null);
            newUser.setBannerImageUrl(null);
            newUser.setDiscord("");
            newUser.setTwitter("");
            newUser.setVerified(false);
            newUser.setBanned(false);
            newUser.setCreatedAt(new Date().toString());
            newUser.setUpdatedAt(new Date().toString());
            userRepository.save(newUser);
        }

        pendingMessages.remove(address);

        return ResponseEntity.ok(Map.of("message", "Login success", "token", token));
    }
@GetMapping("/me") 
public ResponseEntity<?> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader,
                             @CookieValue(value = "access_token", required = false) String cookieToken) {
    String token = null;
    
    // Debug logging
    System.out.println("Auth Header: " + authHeader);
    System.out.println("Cookie Token: " + cookieToken);
    
    // Check header first, then cookie
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    } else if (cookieToken != null) {
        token = cookieToken;
    }

    if (token == null) {
        return ResponseEntity.status(401).body(Map.of("error", "No authentication token provided"));
    }

    try {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(SECRET_KEY)
            .build()
            .parseClaimsJws(token)
            .getBody();
            
        String address = claims.getSubject();
        System.out.println("Verified address from token: " + address); // Debug log
        
        Optional<User> userOpt = userRepository.findByWalletAddress(address.toLowerCase());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                "error", "User not found",
                "address", address
            ));
        }

        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
            "address", user.getWalletAddress(),
            "avatarUrl", user.getProfileImageUrl(),
            "username", user.getUsername(),
            "bio", user.getBio(),
            "website", user.getWebsite()
        ));

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(401).body(Map.of(
            "error", "Invalid or expired token",
            "details", e.getMessage()
        ));
    }
}

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("access_token", null);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}
