package com.fyp.server.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.fyp.server.entity.RecommendationEntity;

import org.springframework.stereotype.Repository;

@Repository
public interface RecommendationRepository extends MongoRepository<RecommendationEntity, String> {
}
