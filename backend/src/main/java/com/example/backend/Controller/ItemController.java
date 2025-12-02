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
}

