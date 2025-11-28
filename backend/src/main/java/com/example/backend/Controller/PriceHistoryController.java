package com.example.backend.Controller;

import com.example.backend.model.PriceHistory;
import com.example.backend.repository.PriceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/price-history")
public class PriceHistoryController {

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<PriceHistory>> getPriceHistoryByItem(@PathVariable String itemId) {
        List<PriceHistory> history = priceHistoryRepository.findByItemIdOrderByTimestampDesc(itemId);
        return ResponseEntity.ok(history);
    }
}

