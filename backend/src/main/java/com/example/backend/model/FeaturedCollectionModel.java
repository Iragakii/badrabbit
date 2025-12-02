package com.example.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "featured_collections")
public class FeaturedCollectionModel {

    @Id
    private String id;

    private String collectionId;      // Reference to CollectionModel
    private String name;             // Collection name (denormalized for quick access)
    private String image;            // Collection image
    private String bannerImage;      // Banner image for carousel
    private String chain;            // Chain name
    private int displayOrder;       // Order in carousel (1-5)
    private boolean active;         // Whether to show in carousel
    private Date createdAt;
    private Date updatedAt;
}

