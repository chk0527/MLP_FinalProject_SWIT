package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swit.dto.AnswerDTO;
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

  @PostMapping("/add") //그룹 생성 - 방장
  public Map<String, Integer> register(@RequestBody GroupDTO groupDTO) {
    Integer groupNo = service.register(groupDTO);
    // List<MultipartFile> files = productDTO.getFiles();
    // List<String> uploadFileNames = fileUtil.saveFiles(files);
    return Map.of("groupNo", groupNo);
  }
  @PostMapping("/join") // 그룹 가입
  public Map<String, Integer> registerWithAnswer(@RequestBody Map<String, Object> request) {
      ObjectMapper objectMapper = new ObjectMapper();
      GroupDTO groupDTO = objectMapper.convertValue(request.get("group"), GroupDTO.class);
      AnswerDTO answerDTO = objectMapper.convertValue(request.get("answer"), AnswerDTO.class);
      Integer groupNo = service.registerWithAnswer(groupDTO, answerDTO);
      return Map.of("groupNo", groupNo);
  }
  // @PostMapping("/join") // 그룹 가입
  //   public Map<String, Integer> registerWithAnswer(@RequestBody Map<String, Object> request) {
  //       GroupDTO groupDTO = new ObjectMapper().convertValue(request.get("group"), GroupDTO.class);
  //       AnswerDTO answerDTO = new ObjectMapper().convertValue(request.get("answer"), AnswerDTO.class);
  //       Integer groupNo = service.registerWithAnswer(groupDTO, answerDTO);
  //       return Map.of("groupNo", groupNo);
  //   }
  
  @GetMapping("/isMember") //그룹 가입 승인 여부 판별
  public Integer isMember(@RequestParam("userId") String userId, @RequestParam("studyNo") Integer studyNo) {
    return service.isMember(userId, studyNo);
  }

  @GetMapping("/isLeader") //그룹장 여부 판별
  public boolean isLeader(@RequestParam("userId") String userId, @RequestParam("studyNo") Integer studyNo) {    
    return service.isLeader(userId, studyNo);
  }

  @PutMapping("/confirm") //그룹 가입 승인, 거절(방장)
    public boolean confirmGroupJoin(@RequestParam("groupNo") Integer groupNo, @RequestParam("approve") boolean approve) {
        return service.confirmGroupJoin(groupNo, approve);
    }

    @GetMapping("/requests") //그룹 가입 요청 목록 조회
    public List<GroupRequestDTO> getGroupJoinRequests(@RequestParam("studyNo") Integer studyNo) {
      log.info("!");
        return service.getPendingGroupRequestsByStudyNo(studyNo);
    }

    @GetMapping("/memberCount") //가입 인원 수 가져오기
    public int getCurrentMemberCount(@RequestParam("studyNo") Integer studyNo) {
      return service.getCurrentMemberCount(studyNo);
    }

}
