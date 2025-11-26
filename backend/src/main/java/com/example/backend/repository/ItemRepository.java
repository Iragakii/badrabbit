package com.example.backend.repository;

import com.example.backend.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByOwnerWallet(String ownerWallet);
}

