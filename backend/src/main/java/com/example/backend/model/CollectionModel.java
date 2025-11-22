package com.example.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "collections")
public class CollectionModel {

    @Id
    private String id;

    private String name;                // Collection name
    private String description;         // Optional description
    private String ownerWallet;         // Wallet address of creator
    private String chain;               // Ethereum, Polygon, etc.
    private String type;                // ERC721 / ERC1155
    private String image;               // IPFS CID or URL (collection image)
    private String bannerImage;         // Optional (added later)
    private String featuredImage;       // Optional (added later)
    private String contractAddress;     // Empty until deployed
    private String status;              // "draft" | "deployed" | "verified"

    private double royaltyPercent;      // optional
    private String website;             // optional
    private String twitter;             // optional
    private String discord;             // optional

    private Date createdAt;
    private Date updatedAt;
}
