package com.example.backend.repository;

import com.example.backend.model.NewsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NewsRepository extends MongoRepository<NewsModel, String> {
    List<NewsModel> findByActiveOrderByDisplayOrderAsc(Boolean active);
}

