package com.swit.controller;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.swit.service.JoinService;

import lombok.extern.log4j.Log4j2;

import com.swit.dto.JoinDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@ResponseBody
@Log4j2
public class JoinController {
    
    private final JoinService joinService;

    public JoinController(JoinService joinService) {
        
        this.joinService = joinService;
    }

    @PostMapping("/join")
    public String joinProcess(JoinDTO joinDTO) {
        log.info("before joinDTO " + joinDTO);
        System.out.println("JoinController userId : " + joinDTO.getUserId());
        System.out.println("JoinController userName : " + joinDTO.getUserName());
        System.out.println("JoinController userPassword : " + joinDTO.getUserPassword());
        System.out.println("JoinController userDeleteChk : " + joinDTO.getUserDeleteChk());
        
        joinService.joinProcess(joinDTO);
        
        log.info("after joinDTO " + joinDTO);
        return "ok";
    }
}