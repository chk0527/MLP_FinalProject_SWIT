package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.swit.dto.StudyDTO;
import com.swit.service.StudyService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/study")
public class StudyController {
    private final StudyService service;
    private final HttpSession session;

    @GetMapping("/{studyNo}")
    public StudyDTO getStudy(@PathVariable(name="studyNo") Integer studyNo) {
        return service.get(studyNo);
    }

    @PostMapping("/")
    public Map<String, Integer> register(@RequestBody StudyDTO StudyDTO) {
        Integer studyNo = service.register(StudyDTO);
        // List<MultipartFile> files = productDTO.getFiles();
        // List<String> uploadFileNames = fileUtil.saveFiles(files);
        return Map.of("studyNo", studyNo);
    }
    
}
