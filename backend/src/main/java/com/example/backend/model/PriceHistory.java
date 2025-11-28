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
@Document(collection = "price_history")
public class PriceHistory {
    @Id
    private String id;

    private String itemId;
    private String type;                 // "offer", "sale", "listing"
    private Double price;
    private String currency;              // "WETH", "ETH", etc.
    private String fromWallet;            // Wallet that created the offer/sale
    private String toWallet;              // Wallet that received (for sales)
    private Date timestamp;
}

