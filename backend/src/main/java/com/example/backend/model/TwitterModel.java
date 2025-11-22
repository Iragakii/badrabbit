package com.example.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TwitterModel {
    private String id;
    private String username;
    private String displayName;
    private String profileImageUrl;
}
