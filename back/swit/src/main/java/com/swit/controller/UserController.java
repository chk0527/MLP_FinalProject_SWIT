package com.swit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.User;
import com.swit.repository.UserRepository;

@RestController
public class UserController {
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/user")
    public User getUser(@RequestParam String user_id) {
        return userRepository.findById(user_id).orElse(null);
    }
}
