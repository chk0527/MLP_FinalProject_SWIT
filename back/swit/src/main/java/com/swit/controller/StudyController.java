package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.swit.domain.Study;
import com.swit.dto.StudyDTO;
import com.swit.service.StudyService;
import com.swit.util.CustomFileUtil;

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
    private final CustomFileUtil fileUtil;

    @GetMapping("/all")
    public List<Study> getAllStudies() {
        String userId = (String) session.getAttribute("userId");
        log.info("Logged in user: " + userId);

        List<Study> studyList = service.getAllStudies(); // StudyService에 새로운 메서드 추가 필요

        log.info("Study List: " + studyList);
        return studyList;
    }

    @GetMapping("/{studyNo}")
    public StudyDTO getStudy(@PathVariable(name = "studyNo") Integer studyNo) {
        return service.get(studyNo);
    }

    @PostMapping("/")
    public Map<String, Integer> register(StudyDTO StudyDTO) {
        List<MultipartFile> files = StudyDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        StudyDTO.setUploadFileNames(uploadFileNames);
        log.info(uploadFileNames);
        // 서비스 호출
        Integer studyNo = service.register(StudyDTO);
        return Map.of("studyNo", studyNo);
    }

    @GetMapping("/display/{fileName}")
    public ResponseEntity<Resource> displayFileGet(@PathVariable String fileName) {
        return fileUtil.getFile(fileName);
    }
}
