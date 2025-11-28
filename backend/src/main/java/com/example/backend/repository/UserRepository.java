package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByWalletAddress(String walletAddress);
    List<User> findByUsernameContainingIgnoreCase(String username);
    List<User> findByWalletAddressContainingIgnoreCase(String walletAddress);
}
