package com.fyp.server.repository;


import com.fyp.server.entity.AuthProviderType;
import com.fyp.server.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderIdAndProviderType(String providerId, AuthProviderType providerType);
}
