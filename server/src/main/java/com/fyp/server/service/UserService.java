package com.fyp.server.service;
import com.fyp.server.entity.User;
import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public UserService(UserRepository userRepository, ModelMapper modelMapper){
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public User createUser(SignUpRequestDTO req) {
        userRepository.findByEmail(req.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already exists");
        });
        User user = modelMapper.map(req, User.class);
        return userRepository.save(user);
    }
}