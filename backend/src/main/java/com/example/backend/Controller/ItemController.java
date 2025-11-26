package com.example.backend.Controller;

import com.example.backend.model.Item;
import com.example.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

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
        Date now = new Date();
        item.setCreatedAt(now);
        item.setUpdatedAt(now);
        Item saved = itemRepository.save(item);
        return ResponseEntity.ok(saved);
    }
}

