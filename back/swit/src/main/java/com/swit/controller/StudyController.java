package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Study;
import com.swit.dto.StudyDTO;
import com.swit.service.StudyService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;




@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/study")
public class StudyController {
    private final StudyService service;
    private final HttpSession session;


    @GetMapping("/all")
    public List<Study> getAllStudies() {
        String userId = (String) session.getAttribute("userId");
        log.info("Logged in user: " + userId);

        List<Study> studyList = service.getAllStudies(); // StudyService에 새로운 메서드 추가 필요

        log.info("Study List: " + studyList);
        return studyList;
    }


    @GetMapping("/{studyNo}")
    public StudyDTO getStudy(@PathVariable(name="studyNo") Integer studyNo) {
        return service.get(studyNo);
    }

    @PostMapping("/")
    public Map<String, Integer> register(@RequestBody StudyDTO StudyDTO) {
        Integer studyNo = service.register(StudyDTO);
        return Map.of("studyNo", studyNo);
    }
    
}
