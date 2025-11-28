package com.example.backend.repository;

import com.example.backend.model.PriceHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PriceHistoryRepository extends MongoRepository<PriceHistory, String> {
    List<PriceHistory> findByItemIdOrderByTimestampDesc(String itemId);
    List<PriceHistory> findByItemIdAndTypeOrderByTimestampDesc(String itemId, String type);
}

