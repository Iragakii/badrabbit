package com.example.backend.Controller;

import com.example.backend.model.Item;
import com.example.backend.model.PriceHistory;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.PriceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Calendar;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemRepository.findAll();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/owner/{walletAddress}")
    public ResponseEntity<List<Item>> getItemsByOwner(@PathVariable String walletAddress) {
        List<Item> items = itemRepository.findByOwnerWallet(walletAddress.toLowerCase());
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        if (item.getOwnerWallet() != null) {
            item.setOwnerWallet(item.getOwnerWallet().toLowerCase());
        }
        // Ensure listed defaults to false if not explicitly set to true
        // Since boolean primitive defaults to false, we just need to make sure
        // the frontend sends false explicitly (which we've fixed)
        
        Date now = new Date();
        item.setCreatedAt(now);
        item.setUpdatedAt(now);
        Item saved = itemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        System.out.println("Fetching item with ID: " + id);
        if (id == null || id.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return itemRepository.findById(id.trim())
                .map(item -> {
                    System.out.println("Found item: " + item.getName());
                    return ResponseEntity.ok(item);
                })
                .orElseGet(() -> {
                    System.out.println("Item not found with ID: " + id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    // Keep the original route for backward compatibility, but check if it's not "owner"
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemByIdLegacy(@PathVariable String id) {
        // If the path is "owner", this shouldn't match (Spring should route to /owner/{walletAddress} first)
        // But just in case, check if it looks like a wallet address (starts with 0x)
        if (id != null && id.startsWith("0x")) {
            return ResponseEntity.badRequest().build();
        }
        System.out.println("Fetching item with ID (legacy route): " + id);
        if (id == null || id.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return itemRepository.findById(id.trim())
                .map(item -> {
                    System.out.println("Found item: " + item.getName());
                    return ResponseEntity.ok(item);
                })
                .orElseGet(() -> {
                    System.out.println("Item not found with ID: " + id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getItemStats(@PathVariable String id) {
        try {
            Optional<Item> itemOpt = itemRepository.findById(id);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Item item = itemOpt.get();
            
            // Get price history for this item
            List<com.example.backend.model.PriceHistory> priceHistory = 
                    priceHistoryRepository.findByItemIdOrderByTimestampDesc(id);

            // Calculate current price (list price, most recent sale, or top offer)
            double currentPrice = 0.0;
            
            // First check if item has a list price
            if (item.getListPrice() != null && item.getListPrice() > 0) {
                currentPrice = item.getListPrice();
            } else if (!priceHistory.isEmpty()) {
                // Fallback to most recent price history
                com.example.backend.model.PriceHistory latest = priceHistory.get(0);
                if (latest.getPrice() != null) {
                    currentPrice = latest.getPrice();
                }
            }

            // Calculate weekly volume (sales in last 7 days)
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, -7);
            Date weekAgo = cal.getTime();

            double weeklyVolume = priceHistory.stream()
                    .filter(ph -> ph.getType() != null && ph.getType().equals("sale") &&
                            ph.getTimestamp() != null && ph.getTimestamp().after(weekAgo))
                    .mapToDouble(ph -> ph.getPrice() != null ? ph.getPrice() : 0.0)
                    .sum();

            Map<String, Object> stats = Map.of(
                    "currentPrice", currentPrice,
                    "weeklyVolume", weeklyVolume
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to calculate stats: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        try {
            Optional<Item> itemOpt = itemRepository.findById(id);
            if (itemOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Item item = itemOpt.get();
            Date now = new Date();
            
            // Update listed status if provided
            if (updates.containsKey("listed")) {
                Boolean listed = (Boolean) updates.get("listed");
                item.setListed(listed);
                
                // If listing, save price and expiration, and add to price history
                if (listed && updates.containsKey("listPrice")) {
                    Object priceObj = updates.get("listPrice");
                    if (priceObj != null) {
                        Double listPrice = priceObj instanceof Number 
                            ? ((Number) priceObj).doubleValue() 
                            : Double.parseDouble(priceObj.toString());
                        item.setListPrice(listPrice);
                        
                        // Set expiration date if provided
                        if (updates.containsKey("listExpiresAt")) {
                            try {
                                String expiresAtStr = updates.get("listExpiresAt").toString();
                                java.time.Instant instant = java.time.Instant.parse(expiresAtStr);
                                Date expiresAt = Date.from(instant);
                                item.setListExpiresAt(expiresAt);
                            } catch (Exception e) {
                                // If parsing fails, set default expiration based on duration
                                Calendar cal = Calendar.getInstance();
                                Object durationObj = updates.get("duration");
                                int days = 30;
                                if (durationObj != null) {
                                    try {
                                        days = durationObj instanceof Number 
                                            ? ((Number) durationObj).intValue() 
                                            : Integer.parseInt(durationObj.toString());
                                    } catch (Exception ex) {
                                        days = 30;
                                    }
                                }
                                cal.add(Calendar.DAY_OF_MONTH, days);
                                item.setListExpiresAt(cal.getTime());
                            }
                        } else {
                            // Default expiration based on duration
                            Calendar cal = Calendar.getInstance();
                            Object durationObj = updates.get("duration");
                            int days = 30;
                            if (durationObj != null) {
                                try {
                                    days = durationObj instanceof Number 
                                        ? ((Number) durationObj).intValue() 
                                        : Integer.parseInt(durationObj.toString());
                                } catch (Exception ex) {
                                    days = 30;
                                }
                            }
                            cal.add(Calendar.DAY_OF_MONTH, days);
                            item.setListExpiresAt(cal.getTime());
                        }
                        
                        // Add to price history
                        PriceHistory priceHistory = new PriceHistory();
                        priceHistory.setItemId(id);
                        priceHistory.setType("listing");
                        priceHistory.setPrice(listPrice);
                        priceHistory.setCurrency("ETH");
                        priceHistory.setFromWallet(item.getOwnerWallet());
                        priceHistory.setTimestamp(now);
                        priceHistoryRepository.save(priceHistory);
                    }
                } else if (!listed) {
                    // If unlisting, clear price and expiration
                    item.setListPrice(null);
                    item.setListExpiresAt(null);
                }
            }
            
            item.setUpdatedAt(now);
            
            Item saved = itemRepository.save(item);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to update item: " + e.getMessage()));
        }
    }
}

