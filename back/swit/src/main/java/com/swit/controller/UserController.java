package com.swit.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.UserDTO;
import com.swit.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/user")

public class UserController {
    private final UserService service;

    @GetMapping("/{user_id}")
    public UserDTO get(@PathVariable(name="user_id") String user_id) {
        return service.get(user_id);
    }
}
