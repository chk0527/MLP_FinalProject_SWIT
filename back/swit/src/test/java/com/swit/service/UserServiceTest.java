package com.swit.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.swit.dto.UserDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class UserServiceTest {
    @Autowired
    private UserService userService;

    @Test
    public void testGet() {
        String user_id = "user1";
        UserDTO userDTO = userService.get(user_id);
        log.info(userDTO);
        //log.info(userDTO.getUploadFileNames());
    }
}
