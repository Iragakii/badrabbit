package com.example.backend.repository;

import com.example.backend.model.CollectionModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CollectionRepository extends MongoRepository<CollectionModel, String> {
    List<CollectionModel> findByOwnerWallet(String ownerWallet);
    Optional<CollectionModel> findByName(String name);
}
