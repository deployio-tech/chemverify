package com.fyp.server.repository;

import com.fyp.server.entity.UserChem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserChemRepository extends MongoRepository<UserChem,String> {
    List<UserChem> findByUserIdOrderByCreatedAtDesc(String userId);
}
