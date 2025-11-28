package com.example.backend.Controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("address") String address) {

        try {
            // Save file locally (for development)
            String uploadDir = "uploads/avatars/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = address + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://localhost:8081/" + uploadDir + fileName;

            // Update user avatar in MongoDB
            User user = userRepository.findByWalletAddress(address)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setWalletAddress(address);
                        return newUser;
                    });
            user.setProfileImageUrl(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload avatar");
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String address = payload.get("address");
        String username = payload.get("username");
        String bio = payload.get("bio");
        String website = payload.get("website");

        try {
            User user = userRepository.findByWalletAddress(address)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setWalletAddress(address);
                        return newUser;
                    });
            if (username != null) user.setUsername(username);
            if (bio != null) user.setBio(bio);
            if (website != null) user.setWebsite(website);
            userRepository.save(user);

            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update profile");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        
        String query = q.trim();
        List<User> users = new java.util.ArrayList<>();
        
        // Search by username
        users.addAll(userRepository.findByUsernameContainingIgnoreCase(query));
        
        // Search by wallet address (if it looks like an address)
        if (query.startsWith("0x") && query.length() >= 10) {
            users.addAll(userRepository.findByWalletAddressContainingIgnoreCase(query));
        }
        
        // Remove duplicates based on wallet address
        Map<String, User> uniqueUsers = new java.util.HashMap<>();
        for (User user : users) {
            if (user != null && user.getWalletAddress() != null && !user.getWalletAddress().trim().isEmpty()) {
                uniqueUsers.put(user.getWalletAddress().toLowerCase(), user);
            }
        }
        
        return ResponseEntity.ok(new java.util.ArrayList<>(uniqueUsers.values()));
    }
}
