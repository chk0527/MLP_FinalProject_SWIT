package com.swit.controller;

import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.swit.domain.ChatMessage;
import com.swit.service.ChatService;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessageSendingOperations template;
    private final ChatService chatService;

    // 채팅 리스트 반환
    @GetMapping("/chat/{studyNo}")
  public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable(name="studyNo") Long studyNo){
    // 여기서 스터디 번호를 기반으로 채팅 내용을 가져옴
    // Ex) studyNo를 사용하여 해당 스터디의 채팅 내용을 DB에서 가져옴.
    List<ChatMessage> chatMessages = chatService.getChatMessagesByStudyNo(studyNo); // 적절한 메소드 호출 필요
    return ResponseEntity.ok().body(chatMessages);
}

    // 메시지 송신 및 수신, /pub가 생략된 모습. 클라이언트 단에선 /pub/message로 요청
    @MessageMapping("/message")
    public void receiveMessage(@RequestBody ChatMessage chat) {
        template.convertAndSend("/sub/chatroom/" + chat.getStudyNo(), chat);
        chatService.saveChatMessage(chat); // 메시지를 저장합니다.
    }
    

    
}