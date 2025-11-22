package com.example.backend.Controller;

import com.example.backend.model.User;
import com.example.backend.model.TwitterModel;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.logging.Logger;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/x")
public class XAuthController {

    @Autowired
    private javax.crypto.SecretKey jwtSecretKey;
    private static final Logger logger = Logger.getLogger(XAuthController.class.getName());

    @Value("${x.client.id}")
    private String clientId;

    @Value("${x.client.secret}")
    private String clientSecret;

    @Value("${x.redirect.uri}")
    private String redirectUri;

    @Value("${frontend.redirect.uri}")
    private String frontendRedirect;

    @Autowired
    private UserRepository userRepository;

    // In-memory store for demo. Use Redis/DB in production.
    private final Map<String, String> pkceStore = new ConcurrentHashMap<>(); // state -> code_verifier
    private final Map<String, String> walletStore = new ConcurrentHashMap<>(); // state -> walletAddress

    @GetMapping("/login")
    public ResponseEntity<Void> login(@RequestParam String walletAddress) {
        String state = UUID.randomUUID().toString();
        String codeVerifier = generateCodeVerifier();
        String codeChallenge = codeChallengeFromVerifier(codeVerifier);
        pkceStore.put(state, codeVerifier);
        walletStore.put(state, walletAddress);

        String authUrl = "https://twitter.com/i/oauth2/authorize"
            + "?response_type=code"
            + "&client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8)
            + "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8)
            + "&scope=" + URLEncoder.encode("users.read tweet.read offline.access", StandardCharsets.UTF_8)
            + "&state=" + URLEncoder.encode(state, StandardCharsets.UTF_8)
            + "&code_challenge=" + URLEncoder.encode(codeChallenge, StandardCharsets.UTF_8)
            + "&code_challenge_method=S256";

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(authUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam String code, @RequestParam String state, HttpServletResponse response) {
        System.out.println("X OAuth callback received: code=" + code + ", state=" + state);
        try {
            // 1) verify state & get code_verifier and walletAddress
            String codeVerifier = pkceStore.remove(state);
            String walletAddress = walletStore.remove(state);
            System.out.println("Code verifier: " + codeVerifier + ", Wallet: " + walletAddress);
            if (codeVerifier == null || walletAddress == null) {
                System.out.println("Invalid state or missing data");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            // 2) Exchange code for token
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            String auth = clientId + ":" + clientSecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", "Basic " + encodedAuth);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "authorization_code");
            body.add("code", code);
            body.add("code_verifier", codeVerifier);
            body.add("redirect_uri", redirectUri); // REQUIRED by Twitter

            HttpEntity<MultiValueMap<String, String>> tokenReq = new HttpEntity<>(body, headers);
            System.out.println("Token request body: " + body);
            System.out.println("Exchanging code for token...");
            ResponseEntity<Map> tokenRes = rest.postForEntity("https://api.twitter.com/2/oauth2/token", tokenReq, Map.class);
            System.out.println("Token response status: " + tokenRes.getStatusCode());
            Map<String, Object> tokenBody = tokenRes.getBody();
            if (tokenBody == null || !tokenBody.containsKey("access_token")) {
                System.out.println("Failed to get access token: " + tokenBody);
                throw new RuntimeException("No access token");
            }
            String accessToken = (String) tokenBody.get("access_token");
            String refreshToken = (String) tokenBody.get("refresh_token");
            System.out.println("Access token obtained");

            // 3) Get user profile
            HttpHeaders uh = new HttpHeaders();
            uh.setBearerAuth(accessToken);
            System.out.println("Fetching user profile...");
            ResponseEntity<Map> userRes = rest.exchange("https://api.twitter.com/2/users/me", HttpMethod.GET, new HttpEntity<>(uh), Map.class);
            System.out.println("User profile response status: " + userRes.getStatusCode());
            Map<String, Object> userData = userRes.getBody();
            if (userData == null || !userData.containsKey("data")) {
                System.out.println("Failed to get user data: " + userData);
                throw new RuntimeException("No user data");
            }
            Map<String, Object> userInfo = (Map<String, Object>) userData.get("data");
            System.out.println("User profile: " + userInfo);

            // 4) Persist link: find or create user record by wallet
            User user = userRepository.findByWalletAddress(walletAddress)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setWalletAddress(walletAddress);
                        return newUser;
                    });

            // Create TwitterModel and set it
            TwitterModel twitterProfile = new TwitterModel();
            twitterProfile.setId((String) userInfo.get("id"));
            twitterProfile.setUsername((String) userInfo.get("username"));
            twitterProfile.setDisplayName((String) userInfo.get("name"));
            twitterProfile.setProfileImageUrl((String) userInfo.get("profile_image_url"));
            user.setTwitter(twitterProfile);

            userRepository.save(user);
            System.out.println("User saved with Twitter: " + user.getTwitter().getUsername());

            // 5) Create session/jwt cookie for frontend (HttpOnly)
            String jwt = createJwtForUser(walletAddress); // sign user id & linked wallet
            Cookie cookie = new Cookie("access_token", jwt);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // set true in production (https)
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 7);
            response.addCookie(cookie);

            // 6) Redirect to frontend success page (no tokens in URL)
            URI redirect = URI.create(frontendRedirect + "?connected=1");
            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.setLocation(redirect);
            System.out.println("Redirecting to: " + redirect);
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);

        } catch (Exception ex) {
            System.err.println("Token exchange failed: " + ex.getMessage());
            if (ex instanceof HttpClientErrorException) {
                System.err.println("Response body: " + ((HttpClientErrorException) ex).getResponseBodyAsString());
            }
            ex.printStackTrace();
            // optional: redirect back to frontend with error
            URI redirect = URI.create(frontendRedirect + "?error=1");
            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.setLocation(redirect);
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);
        }
    }

    private String generateCodeVerifier() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] codeVerifier = new byte[32];
        secureRandom.nextBytes(codeVerifier);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(codeVerifier);
    }

    private String codeChallengeFromVerifier(String codeVerifier) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(codeVerifier.getBytes(StandardCharsets.US_ASCII));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String createJwtForUser(String walletAddress) {
        // Create a real JWT token
        long nowMillis = System.currentTimeMillis();
        java.util.Date now = new java.util.Date(nowMillis);
        long expMillis = nowMillis + 86400000; // 24 hours
        java.util.Date exp = new java.util.Date(expMillis);

        return Jwts.builder()
            .setSubject(walletAddress)
            .setIssuedAt(now)
            .setExpiration(exp)
            .signWith(jwtSecretKey)
            .compact();
    }

    @PostMapping("/disconnect")
    public ResponseEntity<?> disconnect(@RequestParam String walletAddress, HttpServletRequest request) {
        logger.info("Disconnect request received for wallet: " + walletAddress);
        try {
            // Verify JWT token from HttpOnly cookie
            Cookie[] cookies = request.getCookies();
            String token = null;
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("access_token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
            logger.info("Token from cookie: " + (token != null ? token.substring(0, Math.min(20, token.length())) + "..." : "null"));
            if (token == null) {
                logger.warning("No JWT token in cookie");
                return ResponseEntity.status(401).body(Map.of("error", "No JWT token provided"));
            }
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
            String tokenAddress = claims.getSubject();
            logger.info("Token subject: " + tokenAddress + ", requested wallet: " + walletAddress);
            if (!tokenAddress.equalsIgnoreCase(walletAddress)) {
                logger.warning("Token address mismatch");
                return ResponseEntity.status(401).body(Map.of("error", "Token address mismatch"));
            }

            // Find user by wallet address
            Optional<User> userOpt = userRepository.findByWalletAddress(walletAddress.toLowerCase());
            if (userOpt.isEmpty()) {
                logger.warning("User not found for wallet: " + walletAddress);
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            User user = userOpt.get();
            logger.info("Found user: " + user.getWalletAddress() + ", twitter: " + (user.getTwitter() != null ? user.getTwitter().getUsername() : "null"));

            // Set twitter to null
            user.setTwitter(null);

            // Save user
            userRepository.save(user);
            logger.info("User saved successfully");

            logger.info("User " + user.getWalletAddress() + " disconnected X account");

            return ResponseEntity.ok(Map.of("message", "X account disconnected successfully"));
        } catch (Exception e) {
            logger.severe("Error disconnecting X account: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
}
