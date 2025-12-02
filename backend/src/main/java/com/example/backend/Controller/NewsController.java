package com.example.backend.Controller;

import com.example.backend.model.NewsModel;
import com.example.backend.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsRepository newsRepository;

    @GetMapping
    public ResponseEntity<List<NewsModel>> getActiveNews() {
        List<NewsModel> news = newsRepository.findByActiveOrderByDisplayOrderAsc(true);
        return ResponseEntity.ok(news);
    }

    @PostMapping
    public ResponseEntity<?> createNews(@RequestBody NewsModel news) {
        try {
            // Validate required fields
            if (news.getTitle() == null || news.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title is required"));
            }
            
            if (news.getDescription() == null || news.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Description is required"));
            }

            // Set default values
            if (news.getActive() == null) {
                news.setActive(true);
            }
            if (news.getDisplayOrder() == null || news.getDisplayOrder() == 0) {
                // Set display order to next available number
                List<NewsModel> allNews = newsRepository.findAll();
                int maxOrder = allNews.stream()
                    .filter(n -> n.getDisplayOrder() != null)
                    .mapToInt(NewsModel::getDisplayOrder)
                    .max()
                    .orElse(0);
                news.setDisplayOrder(maxOrder + 1);
            }
            
            news.setCreatedAt(new Date());
            news.setUpdatedAt(new Date());
            
            NewsModel saved = newsRepository.save(news);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error creating news: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create news: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNews(@PathVariable String id, @RequestBody NewsModel news) {
        try {
            return newsRepository.findById(id)
                .map(existingNews -> {
                    if (news.getTitle() != null) existingNews.setTitle(news.getTitle());
                    if (news.getDescription() != null) existingNews.setDescription(news.getDescription());
                    if (news.getImage() != null) existingNews.setImage(news.getImage());
                    if (news.getSource() != null) existingNews.setSource(news.getSource());
                    if (news.getLink() != null) existingNews.setLink(news.getLink());
                    if (news.getDate() != null) existingNews.setDate(news.getDate());
                    if (news.getActive() != null) existingNews.setActive(news.getActive());
                    if (news.getDisplayOrder() != null && news.getDisplayOrder() > 0) existingNews.setDisplayOrder(news.getDisplayOrder());
                    
                    existingNews.setUpdatedAt(new Date());
                    
                    NewsModel updated = newsRepository.save(existingNews);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error updating news: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update news: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNews(@PathVariable String id) {
        try {
            if (newsRepository.existsById(id)) {
                newsRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "News deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting news: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete news: " + e.getMessage()));
        }
    }
}

