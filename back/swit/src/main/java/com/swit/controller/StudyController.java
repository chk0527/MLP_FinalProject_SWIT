package com.swit.controller;

import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.StudyDTO;
import com.swit.service.StudyService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/study")
public class StudyController {
    private final StudyService service;

    @GetMapping("/{studyNo}")
    public StudyDTO getStudy(@PathVariable(name="studyNo") Integer studyNo) {
        return service.get(studyNo);
    }
}
