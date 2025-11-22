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
        System.out.println("Received collection: " + collection);
        System.out.println("Name: " + collection.getName());
        System.out.println("OwnerWallet: " + collection.getOwnerWallet());
        System.out.println("Image: " + collection.getImage());
        collection.setStatus("draft");
        collection.setCreatedAt(new Date());
        collection.setUpdatedAt(new Date());
        CollectionModel saved = collectionRepository.save(collection);
        return ResponseEntity.ok(saved);
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
}
