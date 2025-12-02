package com.example.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "news")
public class NewsModel {
    @Id
    private String id;

    private String title;
    private String description;
    private String image;           // Image URL
    private String source;          // News source (e.g., "CoinDesk", "Decrypt")
    private String link;            // Link to full article
    private String date;            // Display date (e.g., "2 hours ago")
    private Boolean active;         // Whether the news is currently displayed
    private Integer displayOrder;   // Order in which it should appear
    
    private Date createdAt;
    private Date updatedAt;
}

