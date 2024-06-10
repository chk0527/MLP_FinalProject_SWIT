package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public Map<String, Integer> register(StudyDTO studyDTO) {
        List<MultipartFile> files = studyDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        studyDTO.setUploadFileNames(uploadFileNames);
        log.info(uploadFileNames);
        // 서비스 호출
        Integer studyNo = service.register(studyDTO);
        return Map.of("studyNo", studyNo);
    }

    @PutMapping("/{studyNo}")
    public Map<String, String> modify(@PathVariable(name = "studyNo") Integer studyNo, StudyDTO studyDTO) {
        StudyDTO currentStudyDTO = service.get(studyNo); // 기존 파일 정보를 가져옴
        List<String> oldFileNames = currentStudyDTO.getUploadFileNames();
        List<MultipartFile> newFiles = studyDTO.getFiles();
        List<String> uploadFileNames = fileUtil.modifyFiles(newFiles, oldFileNames);
        studyDTO.setUploadFileNames(uploadFileNames);
        studyDTO.setStudyNo(studyNo);
        log.info("Modify:" + studyDTO);
        service.modify(studyDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    @GetMapping("/display/{fileName}")
    public ResponseEntity<Resource> displayFileGet(@PathVariable String fileName) {
        return fileUtil.getFile(fileName);
    }

    @DeleteMapping("/{studyNo}")
    public Map<String, String> remove(@PathVariable(name = "studyNo") Integer studyNo) {
        log.info("Remove:" + studyNo);
        service.remove(studyNo);
        return Map.of("RESULT", "SUCCESS");
    }
}
