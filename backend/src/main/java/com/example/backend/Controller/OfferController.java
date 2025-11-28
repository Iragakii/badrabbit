package com.example.backend.Controller;

import com.example.backend.model.Offer;
import com.example.backend.model.PriceHistory;
import com.example.backend.repository.OfferRepository;
import com.example.backend.repository.PriceHistoryRepository;
import com.example.backend.repository.ItemRepository;
import com.example.backend.model.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Autowired
    private ItemRepository itemRepository;

    @PostMapping
    public ResponseEntity<?> createOffer(@RequestBody Offer offer) {
        if (offer.getOffererWallet() != null) {
            offer.setOffererWallet(offer.getOffererWallet().toLowerCase());
        }
        if (offer.getOwnerWallet() != null) {
            offer.setOwnerWallet(offer.getOwnerWallet().toLowerCase());
        }

        // Set dates
        Date now = new Date();
        offer.setCreatedAt(now);
        offer.setUpdatedAt(now);
        offer.setStatus("pending");

        // Calculate expiration date
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.DAY_OF_MONTH, offer.getDurationDays());
        offer.setExpiresAt(cal.getTime());

        Offer saved = offerRepository.save(offer);

        // Add to price history
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setItemId(offer.getItemId());
        priceHistory.setType("offer");
        priceHistory.setPrice(offer.getAmount());
        priceHistory.setCurrency(offer.getCurrency());
        priceHistory.setFromWallet(offer.getOffererWallet());
        priceHistory.setTimestamp(now);
        priceHistoryRepository.save(priceHistory);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Offer>> getOffersByItem(@PathVariable String itemId) {
        List<Offer> offers = offerRepository.findByItemId(itemId);
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/item/{itemId}/top")
    public ResponseEntity<?> getTopOffer(@PathVariable String itemId) {
        Optional<Offer> topOffer = offerRepository.findTopByItemIdAndStatusOrderByAmountDesc(itemId, "pending");
        if (topOffer.isPresent()) {
            return ResponseEntity.ok(Map.of("amount", topOffer.get().getAmount(), "currency", topOffer.get().getCurrency()));
        }
        return ResponseEntity.ok(Map.of("amount", null, "currency", "WETH"));
    }

    @GetMapping("/wallet/{walletAddress}")
    public ResponseEntity<List<Offer>> getOffersByWallet(@PathVariable String walletAddress) {
        List<Offer> offers = offerRepository.findByOffererWallet(walletAddress.toLowerCase());
        return ResponseEntity.ok(offers);
    }
}

