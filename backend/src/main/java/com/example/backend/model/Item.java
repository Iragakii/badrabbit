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
@Document(collection = "items")
public class Item {
    @Id
    private String id;

    private String ownerWallet;
    private String name;
    private String collectionName;
    private String imageUrl;
    private String chainName;
    private String chainIcon;
    private boolean listed;
    private Date createdAt;
    private Date updatedAt;
}

