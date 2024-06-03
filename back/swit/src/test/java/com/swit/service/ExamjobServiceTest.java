package com.swit.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.swit.dto.ExamDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class ExamjobServiceTest {
    @Autowired
    private ExamjobService examjobService;

    @Test
    public void testList(){
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
        .page(2)
        .size(5)
        .build();
        PageResponseDTO<ExamDTO> response = examjobService.examList(pageRequestDTO);
        log.info(response);
    }

    @Test
    public void testRead(){
        ExamDTO dto = examjobService.examRead(2);
        log.info(dto);
    }

   
}