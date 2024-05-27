package com.swit.swit;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.swit.dto.StudyDTO;
import com.swit.service.StudyService;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class StudyServiceTest {
    @Autowired
    private StudyService studyService;

    @Test
    public void studyRegister() {
        StudyDTO studyDTO = StudyDTO.builder()
        .studyTitle("테스트용 게시물 입니다.")
        .studyContent("테스트 중")
        .studyType("스터디")
        .studyStartDate(LocalDate.of(2024, 5, 27))
        .studyEndDate(LocalDate.of(2024, 5, 29))
        .studyHeadcount(7)
        .studyOnlineChk(true)
        .studySubject("개발")
        .studyComm("ZOOM")
        .build();

        Integer studyNo = studyService.register(studyDTO);
        log.info("studyNo" + studyNo);
    }

    @Test
    public void testGet(){
        Integer studyNo = 1;
        StudyDTO studyDTO = studyService.get(studyNo);
        log.info(studyDTO);
    }
}
