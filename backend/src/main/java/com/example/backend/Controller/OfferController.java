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

        // Get the current item owner if not provided
        String ownerWallet = offer.getOwnerWallet();
        if (ownerWallet == null || ownerWallet.trim().isEmpty()) {
            Optional<Item> itemOpt = itemRepository.findById(offer.getItemId());
            if (itemOpt.isPresent()) {
                ownerWallet = itemOpt.get().getOwnerWallet();
                if (ownerWallet != null) {
                    offer.setOwnerWallet(ownerWallet.toLowerCase());
                }
            }
        }

        Offer saved = offerRepository.save(offer);

        // Add to price history
        // FROM = offerer (person making the offer), TO = owner (item owner receiving the offer)
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setItemId(offer.getItemId());
        priceHistory.setType("offer");
        priceHistory.setPrice(offer.getAmount());
        priceHistory.setCurrency(offer.getCurrency());
        priceHistory.setFromWallet(offer.getOffererWallet()); // Person making the offer
        priceHistory.setToWallet(ownerWallet != null ? ownerWallet.toLowerCase() : null); // Item owner
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

    @PatchMapping("/{offerId}/accept")
    public ResponseEntity<?> acceptOffer(@PathVariable String offerId, @RequestBody Map<String, String> request) {
        try {
            Optional<Offer> offerOpt = offerRepository.findById(offerId);
            if (offerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Offer offer = offerOpt.get();
            
            // Validate offer status
            if (!"pending".equals(offer.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Offer is not pending"));
            }

            // Check if offer is expired
            if (offer.getExpiresAt() != null && offer.getExpiresAt().before(new Date())) {
                offer.setStatus("expired");
                offerRepository.save(offer);
                return ResponseEntity.badRequest().body(Map.of("error", "Offer has expired"));
            }

            // Update offer status to accepted
            offer.setStatus("accepted");
            offer.setUpdatedAt(new Date());
            offerRepository.save(offer);

            // Update item owner and set to not listed
            Optional<Item> itemOpt = itemRepository.findById(offer.getItemId());
            if (itemOpt.isPresent()) {
                Item item = itemOpt.get();
                item.setOwnerWallet(offer.getOffererWallet());
                item.setListed(false);  // Set to not listed after sale
                item.setListPrice(null);  // Clear listing price
                item.setListExpiresAt(null);  // Clear expiration
                item.setUpdatedAt(new Date());
                itemRepository.save(item);
            }

            // Add to price history as a sale
            // FROM = seller (previous owner), TO = buyer (offerer)
            PriceHistory saleHistory = new PriceHistory();
            saleHistory.setItemId(offer.getItemId());
            saleHistory.setType("sale");
            saleHistory.setPrice(offer.getAmount());
            saleHistory.setCurrency(offer.getCurrency());
            saleHistory.setFromWallet(offer.getOwnerWallet()); // Seller (previous owner)
            saleHistory.setToWallet(offer.getOffererWallet()); // Buyer (new owner)
            saleHistory.setTimestamp(new Date());
            priceHistoryRepository.save(saleHistory);

            // Reject all other pending offers for this item
            List<Offer> otherOffers = offerRepository.findByItemIdAndStatus(offer.getItemId(), "pending");
            for (Offer otherOffer : otherOffers) {
                if (!otherOffer.getId().equals(offerId)) {
                    otherOffer.setStatus("rejected");
                    otherOffer.setUpdatedAt(new Date());
                    offerRepository.save(otherOffer);
                }
            }

            return ResponseEntity.ok(Map.of("message", "Offer accepted successfully", "offer", offer));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to accept offer: " + e.getMessage()));
        }
    }
}

