package com.example.backend.repository;

import com.example.backend.model.CollectionModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CollectionRepository extends MongoRepository<CollectionModel, String> {
    List<CollectionModel> findByOwnerWallet(String ownerWallet);
}
