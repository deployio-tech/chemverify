package com.fyp.server.controller;

import com.fyp.server.dto.SignUpRequestDTO;
import com.fyp.server.entity.User;
import com.fyp.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody SignUpRequestDTO req) {
        User created = userService.createUser(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
