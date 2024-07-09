package com.swit.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swit.repository.ChatMessageRepository;
import com.swit.repository.UserRepository;
import com.swit.repository.StudyRepository;
import com.swit.domain.ChatMessage;
import com.swit.domain.User;
import com.swit.dto.ChatMessageDTO;
import com.swit.domain.Study;

import java.util.List;

@Service
public class ChatService {

  private final ChatMessageRepository chatMessageRepository;
  private final UserRepository userRepository;
  private final StudyRepository studyRepository;

  public ChatService(ChatMessageRepository chatMessageRepository, UserRepository userRepository,
      StudyRepository studyRepository) {
    this.chatMessageRepository = chatMessageRepository;
    this.userRepository = userRepository;
    this.studyRepository = studyRepository;
  }

  public List<ChatMessage> getChatMessagesByStudyNo(Integer studyNo) {
    return chatMessageRepository.findByStudyStudyNo(studyNo);
  }

  @Transactional
  public void saveChatMessage(ChatMessage chatMessage) {
    chatMessageRepository.save(chatMessage);
  }

  public User getUserById(String userId) {
    return userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
  }

  public Study getStudyById(Integer studyNo) {
    return studyRepository.findById(studyNo).orElseThrow(() -> new IllegalArgumentException("Study not found"));
  }

  public ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
    ChatMessageDTO dto = new ChatMessageDTO();
    dto.setId(chatMessage.getId());
    dto.setStudyNo(chatMessage.getStudy().getStudyNo());
    dto.setMessage(chatMessage.getMessage());
    dto.setUserNick(chatMessage.getUser().getUserNick());
    dto.setUserImage(chatMessage.getUser().getUserImage());
    dto.setCreatedDate(chatMessage.getCreatedDate());
    return dto;
  }
}
