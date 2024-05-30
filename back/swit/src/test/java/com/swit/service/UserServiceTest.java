package com.swit.service;

import java.time.LocalDateTime;

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
    // public void testRegister() {
    //     UserDTO userDTO = UserDTO.builder().user_id("user101").user_email("user@swit101.com")
    //         .user_name("김철수101").user_password("1234")
    //         .user_phone("010-1234-1234").user_nick("슈퍼맨")
    //         .user_sns_connect("").user_image("d:/upload/profile.png")
    //         .user_delete_chk(false).user_create_date(LocalDateTime.now())
    //         .build();

    //     String user_id = userService.register(userDTO);
    //     log.info("user_id : " + user_id);
    // }

}
