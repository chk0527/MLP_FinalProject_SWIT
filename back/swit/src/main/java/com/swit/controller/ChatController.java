package com.swit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.ChatMessage;
import com.swit.domain.Study;
import com.swit.domain.User;
import com.swit.dto.ChatMessageDTO;
import com.swit.repository.StudyRepository;
import com.swit.repository.UserRepository;
import com.swit.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
public class ChatController {

  private final SimpMessageSendingOperations template;
  private final ChatService chatService;

  @Autowired
  private StudyRepository studyRepository;

  @Autowired
  private UserRepository userRepository;

  // 채팅 리스트 반환
  @GetMapping("api/chat/{studyNo}")
  public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable(name = "studyNo") Integer studyNo) {
    // 여기서 스터디 번호를 기반으로 채팅 내용을 가져옴
    // Ex) studyNo를 사용하여 해당 스터디의 채팅 내용을 DB에서 가져옴.
    List<ChatMessage> chatMessages = chatService.getChatMessagesByStudyNo(studyNo); // 적절한 메소드 호출 필요
    return ResponseEntity.ok().body(chatMessages);
  }

  @MessageMapping("/message")
  public void receiveMessage(@RequestBody Map<String, String> chatPayload) {
    Integer studyNo = Integer.valueOf(chatPayload.get("studyNo"));
    String userId = chatPayload.get("userId");
    String messageContent = chatPayload.get("message");

    Study study = studyRepository.findById(studyNo).orElseThrow(() -> new RuntimeException("Study not found"));
    User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("User not found"));

    ChatMessage chatMessage = new ChatMessage(study, user.getUserNick(),user.getUserImage() , messageContent, user);
    chatService.saveChatMessage(chatMessage);

    ChatMessageDTO chatMessageDTO = chatService.convertToDTO(chatMessage);
    template.convertAndSend("/sub/chatroom/" + studyNo, chatMessageDTO);
  }

}