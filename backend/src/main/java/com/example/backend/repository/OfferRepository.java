package com.example.backend.repository;

import com.example.backend.model.Offer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends MongoRepository<Offer, String> {
    List<Offer> findByItemId(String itemId);
    List<Offer> findByOffererWallet(String offererWallet);
    List<Offer> findByOwnerWallet(String ownerWallet);
    List<Offer> findByItemIdAndStatus(String itemId, String status);
    Optional<Offer> findTopByItemIdAndStatusOrderByAmountDesc(String itemId, String status);
}

