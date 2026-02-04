package com.fyp.server.service;
import com.fyp.server.entity.User;
import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.repository.UserRepository;
import com.fyp.server.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final AuthService authService;

    public User createUser(SignUpRequestDTO req) {
        return authService.signUpInternal(req);
    }
}