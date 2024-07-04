package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody; // 추가된 부분
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // 추가된 부분
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.swit.domain.Study;
import com.swit.dto.GroupDTO;
import com.swit.dto.StudyDTO;
import com.swit.dto.StudyPageRequestDTO;
import com.swit.dto.BoardPageResponseDTO;
import com.swit.dto.StudyWithQuestionDTO;
import com.swit.service.GroupService;
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
    private final GroupService groupService;
    private final HttpSession session;
    private final CustomFileUtil fileUtil;

    @GetMapping("/all")
    public BoardPageResponseDTO<Study> getAllStudies(
            @RequestParam(name = "studyTitle", required = false) String studyTitle, // 수정된 부분
            @RequestParam(name = "studySubject", required = false) String studySubject, // 수정된 부분
            @RequestParam(name = "studyAddr", required = false) String studyAddr, // 수정된 부분
            @RequestParam(name = "studyOnline", required = false) Boolean studyOnline,
            @RequestParam(name = "userId", required = false) String userId,
            StudyPageRequestDTO pageRequestDTO) {
        log.info(pageRequestDTO);
        return service.studyList(studyTitle, studySubject, studyAddr, studyOnline, userId, pageRequestDTO);
    }

    @GetMapping("/myStudy") // 내 스터디 목록
    public List<Study> myStudy(@RequestParam("userId") String userId) {
        return service.myStudy(userId);
    }

    @GetMapping("/{studyNo}")
    public StudyDTO getStudy(@PathVariable(name = "studyNo") Integer studyNo) {
        return service.get(studyNo);
    }

    @GetMapping("/question/{studyNo}")
    public StudyWithQuestionDTO getStudyWithQuestion(@PathVariable(name = "studyNo") Integer studyNo) {
        return service.getStudyWithQuestionDTO(studyNo);
    }

    @PostMapping("/")
    public Map<String, Integer> register(@ModelAttribute StudyDTO studyDTO,
            @RequestParam("questions") List<String> questions) {
        List<MultipartFile> files = studyDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        studyDTO.setUploadFileNames(uploadFileNames);
        log.info(uploadFileNames);

        Integer studyNo = service.register(studyDTO, questions);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setUserId(userId);
        groupDTO.setStudyNo(studyNo);
        groupDTO.setGroupLeader(1);
        groupDTO.setGroupJoin(1);
        groupService.register(groupDTO);

        return Map.of("studyNo", studyNo);
    }

    @PutMapping("/{studyNo}")
    public Map<String, String> modify(
        @PathVariable(name = "studyNo") Integer studyNo,
        @ModelAttribute StudyDTO studyDTO) { // 수정된 부분
    StudyDTO currentStudyDTO = service.get(studyNo);
    List<String> oldFileNames = currentStudyDTO.getUploadFileNames();
    List<MultipartFile> newFiles = studyDTO.getFiles();
    List<String> uploadFileNames = fileUtil.modifyFiles(newFiles, oldFileNames);
    studyDTO.setUploadFileNames(uploadFileNames);
    studyDTO.setStudyNo(studyNo);
    log.info("Modify:" + studyDTO);
    service.modify(studyDTO, studyDTO.getQuestions());
    return Map.of("RESULT", "SUCCESS");
}



    @GetMapping("/display/{fileName}")
    public ResponseEntity<Resource> displayFileGet(@PathVariable(name = "fileName") String fileName) {
        return fileUtil.getFile(fileName);
    }

    @DeleteMapping("/{studyNo}")
    public Map<String, String> remove(@PathVariable(name = "studyNo") Integer studyNo) {
        log.info("Remove:" + studyNo);
        service.remove(studyNo);
        return Map.of("RESULT", "SUCCESS");
    }

}
