package com.example.backend.Controller;

import com.example.backend.model.FeaturedCollectionModel;
import com.example.backend.model.CollectionModel;
import com.example.backend.repository.FeaturedCollectionRepository;
import com.example.backend.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/featured-collections")
public class FeaturedCollectionController {

    @Autowired
    private FeaturedCollectionRepository featuredCollectionRepository;

    @Autowired
    private CollectionRepository collectionRepository;

    @GetMapping
    public ResponseEntity<List<FeaturedCollectionModel>> getFeaturedCollections() {
        List<FeaturedCollectionModel> featured = featuredCollectionRepository.findByActiveTrueOrderByDisplayOrderAsc();
        return ResponseEntity.ok(featured);
    }

    @PostMapping
    public ResponseEntity<?> createFeaturedCollection(@RequestBody Map<String, Object> request) {
        try {
            Object collectionIdObj = request.get("collectionId");
            String collectionId = collectionIdObj != null ? collectionIdObj.toString() : null;
            Integer displayOrder = request.get("displayOrder") != null 
                ? Integer.parseInt(request.get("displayOrder").toString()) 
                : null;

            if (collectionId == null || collectionId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Collection ID is required"));
            }

            Optional<CollectionModel> collectionOpt = collectionRepository.findById(collectionId);
            if (!collectionOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Collection not found"));
            }

            CollectionModel collection = collectionOpt.get();
            
            FeaturedCollectionModel featured = new FeaturedCollectionModel();
            featured.setCollectionId(collectionId);
            featured.setName(collection.getName());
            featured.setImage(collection.getImage());
            featured.setBannerImage(collection.getBannerImage() != null ? collection.getBannerImage() : collection.getImage());
            featured.setChain(collection.getChain());
            featured.setDisplayOrder(displayOrder != null ? displayOrder : 0);
            featured.setActive(true);
            featured.setCreatedAt(new Date());
            featured.setUpdatedAt(new Date());

            FeaturedCollectionModel saved = featuredCollectionRepository.save(featured);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create featured collection: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeaturedCollection(@PathVariable String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID is required"));
            }
            featuredCollectionRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Featured collection deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete: " + e.getMessage()));
        }
    }
}

