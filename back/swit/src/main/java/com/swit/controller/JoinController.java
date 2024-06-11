package com.swit.controller;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.swit.service.UserService;

import lombok.extern.log4j.Log4j2;

import com.swit.dto.UserDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@ResponseBody
@Log4j2
@RequestMapping("/api/join")
public class JoinController {
    
    private final UserService userService;

    public JoinController(UserService userService) {
        
        this.userService = userService;
    }

    @PostMapping("")
    public String joinProcess(@RequestBody UserDTO userDTO) {
        log.info("before userDTO " + userDTO);
        System.out.println("JoinController userId : " + userDTO.getUserId());
        System.out.println("JoinController userName : " + userDTO.getUserName());
        System.out.println("JoinController userPassword : " + userDTO.getUserPassword());
        System.out.println("JoinController userDeleteChk : " + userDTO.isUserDeleteChk());
        
        userService.join(userDTO);
        
        log.info("after joinDTO " + userDTO);

        return "ok";
    }
}