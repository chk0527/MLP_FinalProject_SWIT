package com.swit.controller;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.swit.service.JoinService;
import com.swit.dto.JoinDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@ResponseBody
public class JoinController {
    
    private final JoinService joinService;

    public JoinController(JoinService joinService) {
        
        this.joinService = joinService;
    }

    @PostMapping("/join")
    public String postMethodName(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    
    public String joinProcess(JoinDTO joinDTO) {

        System.out.println(joinDTO.getUserName());
        joinService.joinProcess(joinDTO);

        return "ok";
    }
}