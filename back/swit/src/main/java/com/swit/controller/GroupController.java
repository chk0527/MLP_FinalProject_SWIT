package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.swit.dto.PendingApplicationDTO;
import com.swit.repository.GroupMemberProjection;
import com.swit.service.GroupService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/group")
public class GroupController {
  private final GroupService service;

  @PostMapping("/add") // 그룹 생성 - 방장
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
  // public Map<String, Integer> registerWithAnswer(@RequestBody Map<String,
  // Object> request) {
  // GroupDTO groupDTO = new ObjectMapper().convertValue(request.get("group"),
  // GroupDTO.class);
  // AnswerDTO answerDTO = new ObjectMapper().convertValue(request.get("answer"),
  // AnswerDTO.class);
  // Integer groupNo = service.registerWithAnswer(groupDTO, answerDTO);
  // return Map.of("groupNo", groupNo);
  // }

  @GetMapping("/isMember") // 그룹 가입 승인 여부 판별
  public Integer isMember(@RequestParam("userId") String userId, @RequestParam("studyNo") Integer studyNo) {
    return service.isMember(userId, studyNo);
  }

  @GetMapping("/isLeader") // 그룹장 여부 판별
  public boolean isLeader(@RequestParam("userId") String userId, @RequestParam("studyNo") Integer studyNo) {
    return service.isLeader(userId, studyNo);
  }

  @PutMapping("/confirm") // 그룹 가입 승인, 거절(방장)
  public boolean confirmGroupJoin(@RequestParam("groupNo") Integer groupNo, @RequestParam("approve") boolean approve) {
    return service.confirmGroupJoin(groupNo, approve);
  }

  @GetMapping("/requests") // 그룹 가입 요청 목록 조회
  public List<GroupRequestDTO> getGroupJoinRequests(@RequestParam("studyNo") Integer studyNo) {
    log.info("!");
    return service.getPendingGroupRequestsByStudyNo(studyNo);
  }

  @GetMapping("/memberCount") // 가입 인원 수 가져오기
  public int getCurrentMemberCount(@RequestParam("studyNo") Integer studyNo) {
    return service.getCurrentMemberCount(studyNo);
  }

  @GetMapping("/{studyNo}/members") // 가입 인원 정보 가져오기
  public List<GroupMemberProjection> getGroupMembers(@PathVariable(name = "studyNo") Integer studyNo) {
    return service.getGroupMembers(studyNo);
  }

  @PutMapping("/expel") //추방 기능 groupJoin값을 3으로 변경 / 0: 승인대기, 1: 승인, 2:거절, 3:추방
  public ResponseEntity<?> expelMember(@RequestParam("userId") String userId,
      @RequestParam("studyNo") Integer studyNo) {
    boolean success = service.expelMember(userId, studyNo);
    if (success) {
      return ResponseEntity.ok().body("Member expelled successfully");
    } else {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to expel member");
    }
  }


  @GetMapping("/check/user") //승인 대기중인 유저 수 확인
  public ResponseEntity<List<PendingApplicationDTO>> getPendingApplications(@RequestParam String userId) {
      List<PendingApplicationDTO> pendingApplications = service.getPendingApplicationsByLeaderId(userId);
      return ResponseEntity.ok(pendingApplications);
  }

  @GetMapping("/check/inquiry") //답변 대기중인 문의 수 확인
  public ResponseEntity<List<PendingApplicationDTO>> getPendingInquiry(@RequestParam String userId) {
      List<PendingApplicationDTO> pendingApplications = service.getPendingInquiryByLeaderId(userId);
      return ResponseEntity.ok(pendingApplications);
  }
}
