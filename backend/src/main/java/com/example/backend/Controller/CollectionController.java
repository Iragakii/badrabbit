package com.example.backend.Controller;

import com.example.backend.model.CollectionModel;
import com.example.backend.repository.CollectionRepository;
import com.example.backend.service.ApillonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private ApillonService apillonService;

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
        return ResponseEntity.ok(collectionRepository.findAll());
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
}
