package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Group;
import com.swit.dto.GroupDTO;
import com.swit.dto.GroupRequestDTO;
import com.swit.service.GroupService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/group")
public class GroupController {
  private final GroupService service;

  @PostMapping("/add") //그룹 가입
  public Map<String, Integer> register(@RequestBody GroupDTO groupDTO) {
    Integer groupNo = service.register(groupDTO);
    // List<MultipartFile> files = productDTO.getFiles();
    // List<String> uploadFileNames = fileUtil.saveFiles(files);
    return Map.of("groupNo", groupNo);
  }

  @GetMapping("/isMember") //그룹 가입 승인 여부 판별
  public Integer isMember(@RequestParam String userId, @RequestParam Integer studyNo) {
    return service.isMember(userId, studyNo);
  }

  @GetMapping("/isLeader") //그룹장 여부 판별
  public boolean isLeader(@RequestParam String userId, @RequestParam Integer studyNo) {    
    return service.isLeader(userId, studyNo);
  }

  @PutMapping("/confirm") //그룹 가입 승인, 거절(방장)
    public boolean confirmGroupJoin(@RequestParam Integer groupNo, @RequestParam boolean approve) {
        return service.confirmGroupJoin(groupNo, approve);
    }

    @GetMapping("/requests") //그룹 가입 요청 목록 조회
    public List<GroupRequestDTO> getGroupJoinRequests(@RequestParam Integer studyNo) {
      log.info("!");
        return service.getPendingGroupRequestsByStudyNo(studyNo);
    }

}
