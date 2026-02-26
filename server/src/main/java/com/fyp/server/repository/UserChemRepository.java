package com.fyp.server.repository;

import com.fyp.server.entity.UserChem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserChemRepository extends MongoRepository<UserChem,String> {
}
