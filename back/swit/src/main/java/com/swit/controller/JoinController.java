package com.swit.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.swit.service.UserService;

import lombok.extern.log4j.Log4j2;

import com.swit.dto.UserDTO;

// import org.hibernate.mapping.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


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

    @GetMapping("/check_duplicate2")
    public Map<String, Boolean> checkDuplicate(
            @RequestParam String userId,
            @RequestParam String userNick,
            @RequestParam String userEmail,
            @RequestParam String userPhone) {

        log.info("userId " + userId);
        log.info("userNick " + userNick);
        log.info("userEmail " + userEmail);
        log.info("userPhone " + userPhone);
        return userService.checkDuplicate2(userId, userNick, userEmail, userPhone);
    }
}