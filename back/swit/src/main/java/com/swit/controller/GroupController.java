package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.swit.domain.Study;
import com.swit.domain.Group;
import com.swit.dto.GroupDTO;
import com.swit.dto.StudyDTO;
import com.swit.service.GroupService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;




@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/group")
public class GroupController {
    private final GroupService service;

    @PostMapping("/add")
    public Map<String, Integer> register(@RequestBody GroupDTO groupDTO) {
        Integer groupNo = service.register(groupDTO);
        // List<MultipartFile> files = productDTO.getFiles();
        // List<String> uploadFileNames = fileUtil.saveFiles(files);
        return Map.of("groupNo", groupNo);
    }
    
}
