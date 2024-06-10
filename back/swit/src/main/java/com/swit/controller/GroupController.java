package com.swit.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.GroupDTO;
import com.swit.service.GroupService;

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

  @GetMapping("/isMember")
  public boolean isMember(@RequestParam Integer studyNo) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String userId = authentication.getName(); // 현재 로그인된 사용자의 아이디를 가져옴
    return service.isMember(userId, studyNo);
  }

}
