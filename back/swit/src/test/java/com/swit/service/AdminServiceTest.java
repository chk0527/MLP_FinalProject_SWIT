package com.swit.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.UserDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class AdminServiceTest {
    @Autowired
    private AdminService adminService;

    @Test
    public void testUserList() {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(1)
                .size(10)
                .build();
        PageResponseDTO<UserDTO> response = adminService.getUserList(pageRequestDTO);
        log.info(response);
    }

}

