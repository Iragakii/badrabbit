package com.example.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    private String walletAddress;
    private String username;
    private String email;
    private String bio;
    private String profileImageUrl;
    private String bannerImageUrl;
    private String discord;
    private String twitter;
    private String website;
    private boolean verified;
    private boolean isBanned;
    private String createdAt;
    private String updatedAt;
}
