package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "offers")
public class Offer {
    @Id
    private String id;

    private String itemId;              // Item being offered on
    private String offererWallet;        // Wallet address of person making offer
    private String ownerWallet;          // Wallet address of item owner
    private Double amount;                // Offer amount in WETH
    private String currency;             // "WETH", "ETH", etc.
    private Integer durationDays;        // Offer expiration in days
    private String status;               // "pending", "accepted", "rejected", "expired"
    private Date createdAt;
    private Date expiresAt;
    private Date updatedAt;
}

