package com.example.backend.config;

import com.example.backend.model.Item;
import com.example.backend.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
public class ItemDataLoader implements CommandLineRunner {

    private final ItemRepository itemRepository;

    public ItemDataLoader(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public void run(String... args) {
        try {
            // Check if MongoDB is available before trying to seed data
            long count = itemRepository.count();
            if (count > 0) {
                System.out.println("Items already exist in database, skipping seed data.");
                return;
            }

            Date now = new Date();
            String defaultOwner = "0x4eb93d214e037926165b9d689818e609d4efe6c4";
            List<Item> seedItems = Arrays.asList(
                    new Item(null, defaultOwner, "Shadow Courier", "Bad Rabbit", "/itemstemp/items-1.jpg", "ETH", "/itemstemp/chain-i.svg", true, 1, "A mysterious courier in the shadows", now, now),
                    new Item(null, defaultOwner, "Midnight Familiar", "Bad Rabbit", "/itemstemp/items-2.jpg", "ETH", "/itemstemp/chain-i.svg", true, 1, "A companion of the night", now, now),
                    new Item(null, defaultOwner, "Neon Driver", "Bad Rabbit", "/itemstemp/items-3.jpg", "ETH", "/itemstemp/chain-i.svg", true, 1, "Racing through neon-lit streets", now, now),
                    new Item(null, defaultOwner, "After Hours", "Bad Rabbit", "/itemstemp/items-4.jpg", "ETH", "/itemstemp/chain-i.svg", true, 1, "The night is just beginning", now, now),
                    new Item(null, defaultOwner, "Smoke Break", "Bad Rabbit", "/itemstemp/items-5.jpg", "ETH", "/itemstemp/chain-i.svg", true, 1, "Taking a moment to breathe", now, now)
            );

            seedItems.forEach(item -> item.setOwnerWallet(item.getOwnerWallet().toLowerCase()));
            itemRepository.saveAll(seedItems);
            System.out.println("Seed data loaded successfully.");
        } catch (Exception e) {
            // Log error but don't crash the application
            System.err.println("Warning: Failed to load seed data. Application will continue without seed data.");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            // Don't rethrow - allow application to start even if seeding fails
        }
    }
}

