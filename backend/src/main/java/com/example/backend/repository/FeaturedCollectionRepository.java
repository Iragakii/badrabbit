package com.example.backend.repository;

import com.example.backend.model.FeaturedCollectionModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeaturedCollectionRepository extends MongoRepository<FeaturedCollectionModel, String> {
    List<FeaturedCollectionModel> findByActiveTrueOrderByDisplayOrderAsc();
}

