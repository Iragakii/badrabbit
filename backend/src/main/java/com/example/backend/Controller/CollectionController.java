package com.example.backend.Controller;

import com.example.backend.model.CollectionModel;
import com.example.backend.repository.CollectionRepository;
import com.example.backend.repository.ItemRepository;
import com.example.backend.repository.PriceHistoryRepository;
import com.example.backend.service.ApillonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Calendar;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private ApillonService apillonService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @PostMapping
    public ResponseEntity<?> createCollection(@RequestBody CollectionModel collection) {
        try {
            System.out.println("Received collection: " + collection);
            System.out.println("Name: " + collection.getName());
            System.out.println("OwnerWallet: " + collection.getOwnerWallet());
            System.out.println("Image: " + collection.getImage());
            
            // Validate required fields
            if (collection.getName() == null || collection.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Collection name is required"));
            }
            
            if (collection.getOwnerWallet() == null || collection.getOwnerWallet().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Owner wallet address is required"));
            }
            
            // Normalize owner wallet to lowercase for consistency
            collection.setOwnerWallet(collection.getOwnerWallet().toLowerCase());
            
            // Set default values
            collection.setStatus("draft");
            collection.setCreatedAt(new Date());
            collection.setUpdatedAt(new Date());
            
            // Save to MongoDB
            CollectionModel saved = collectionRepository.save(collection);
            System.out.println("Collection saved successfully with ID: " + saved.getId());
            
            // Verify the save by checking if it exists in the database
            if (saved.getId() != null) {
                java.util.Optional<CollectionModel> verify = collectionRepository.findById(saved.getId());
                if (verify.isPresent()) {
                    System.out.println("Collection verified in database: " + verify.get().getName());
                } else {
                    System.err.println("WARNING: Collection was not found in database after save!");
                }
            }
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error creating collection: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create collection: " + e.getMessage()));
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadCollectionImage(@RequestParam("file") MultipartFile file) {
        try {
            String ipfsUrl = apillonService.uploadFile(file.getOriginalFilename(), file.getContentType(), file.getBytes());
            return ResponseEntity.ok(Map.of("ipfsUrl", ipfsUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<CollectionModel>> getAllCollections() {
        List<CollectionModel> allCollections = collectionRepository.findAll();
        // Sort by createdAt descending (newest first), or you can add custom sorting logic
        allCollections.sort((a, b) -> {
            if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
            if (a.getCreatedAt() == null) return 1;
            if (b.getCreatedAt() == null) return -1;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });
        return ResponseEntity.ok(allCollections);
    }

    @GetMapping("/owner/{walletAddress}")
    public ResponseEntity<List<CollectionModel>> getCollectionsByOwner(@PathVariable String walletAddress) {
        List<CollectionModel> collections = collectionRepository.findByOwnerWallet(walletAddress.toLowerCase());
        return ResponseEntity.ok(collections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollectionById(@PathVariable String id) {
        return collectionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCollectionByName(@PathVariable String name) {
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return collectionRepository.findByName(name.trim())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getCollectionStats(@PathVariable String id) {
        try {
            java.util.Optional<CollectionModel> collectionOpt = collectionRepository.findById(id);
            if (collectionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            CollectionModel collection = collectionOpt.get();
            
            // Get all items in this collection
            List<com.example.backend.model.Item> items = itemRepository.findAll().stream()
                    .filter(item -> item.getCollectionName() != null && 
                            item.getCollectionName().equalsIgnoreCase(collection.getName()))
                    .collect(java.util.stream.Collectors.toList());

            // Calculate stats from list prices and price history
            double currentPrice = 0.0;
            double previousPrice = 0.0;
            double percentChange = 0.0;

            // Get floor price (minimum list price) from items in this collection
            List<Double> listPrices = items.stream()
                    .filter(item -> item.getListPrice() != null && item.getListPrice() > 0)
                    .map(item -> item.getListPrice())
                    .collect(java.util.stream.Collectors.toList());
            
            if (!listPrices.isEmpty()) {
                // Floor price is the minimum (lowest) list price
                currentPrice = listPrices.stream().mapToDouble(Double::doubleValue).min().orElse(0.0);
            }

            // Get recent sales for items in this collection (last 7 days) for comparison
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, -7);
            Date weekAgo = cal.getTime();

            // Get all price history and filter by items in this collection
            List<com.example.backend.model.PriceHistory> allHistory = priceHistoryRepository.findAll();
            List<String> itemIds = items.stream()
                    .map(item -> item.getId())
                    .collect(java.util.stream.Collectors.toList());
            
            List<com.example.backend.model.PriceHistory> recentSales = allHistory.stream()
                    .filter(ph -> ph.getType() != null && ph.getType().equals("sale") && 
                            ph.getTimestamp() != null && ph.getTimestamp().after(weekAgo) &&
                            itemIds.contains(ph.getItemId()))
                    .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                    .collect(java.util.stream.Collectors.toList());

            // If no list price, use most recent sale
            if (currentPrice == 0.0 && !recentSales.isEmpty()) {
                currentPrice = recentSales.get(0).getPrice() != null ? recentSales.get(0).getPrice() : 0.0;
            }
            
            // Get price from 7 days ago for comparison
            if (recentSales.size() > 1) {
                previousPrice = recentSales.get(recentSales.size() - 1).getPrice() != null ? 
                        recentSales.get(recentSales.size() - 1).getPrice() : 0.0;
            }
            
            if (previousPrice > 0 && currentPrice > 0) {
                percentChange = ((currentPrice - previousPrice) / previousPrice) * 100;
            }

            Map<String, Object> stats = Map.of(
                    "currentPrice", currentPrice,
                    "percentChange", percentChange,
                    "itemCount", items.size()
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to calculate stats: " + e.getMessage()));
        }
    }
}
