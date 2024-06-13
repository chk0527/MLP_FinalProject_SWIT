package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.swit.domain.Answer;
import com.swit.domain.Group;
import com.swit.domain.Study;
import com.swit.domain.User;
import com.swit.dto.AnswerDTO;
import com.swit.dto.CustomUserDetails;
import com.swit.dto.GroupDTO;
import com.swit.dto.GroupRequestDTO;
import com.swit.repository.AnswerRepository;
import com.swit.repository.GroupRepository;
import com.swit.repository.StudyRepository;
import com.swit.repository.UserRepository;
import com.swit.repository.findList;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class GroupService {
  private final ModelMapper modelMapper;
  private final GroupRepository groupRepository;
  private final UserRepository userRepository;
  private final StudyRepository studyRepository;
  private final AnswerRepository answerRepository;

  public List<Group> getAllGroups() {
    return groupRepository.findAll();
  }

  public Integer register(GroupDTO groupDTO) { // 그룹 가입
    Group group = modelMapper.map(groupDTO, Group.class);

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication.getPrincipal() instanceof CustomUserDetails) {
      CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
      String userId = userDetails.getUsername();
      log.info(userDetails.getUserNick() + "$$$$$$");
      group.setUserId(userId);
    } else {
      throw new IllegalStateException("Authentication principal is not an instance of CustomUserDetails");
    }
    Group saveGroup = groupRepository.save(group);
    return saveGroup.getGroupNo();
  }

  public Integer registerWithAnswer(GroupDTO groupDTO, AnswerDTO answerDTO) {
    Group group = modelMapper.map(groupDTO, Group.class);

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication.getPrincipal() instanceof CustomUserDetails) {
      CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
      String userId = userDetails.getUsername();
      group.setUserId(userId);
      answerDTO.setUserId(userId);
    } else {
      throw new IllegalStateException("Authentication principal is not an instance of CustomUserDetails");
    }
    Group savedGroup = groupRepository.save(group);

    Answer answer = modelMapper.map(answerDTO, Answer.class);

    // Study 객체를 데이터베이스에서 조회하여 Answer에 설정
    Study study = studyRepository.findById(groupDTO.getStudyNo())
        .orElseThrow(() -> new IllegalArgumentException("Study not found: " + groupDTO.getStudyNo()));
    answer.setStudy(study);

    // User를 데이터베이스에서 조회하여 Answer에 설정
    User user = userRepository.findByUserId(answerDTO.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("User not found: " + answerDTO.getUserId()));
    answer.setUser(user);

    answerRepository.save(answer);

    return savedGroup.getGroupNo();
  }

  

  public Integer isMember(String userId, Integer studyNo) { // 그룹 가입 승인 여부 판별
    Optional<Group> group = groupRepository.findByUserIdAndStudyNo(userId, studyNo);
    log.info(userId + "@@@@@@@" + studyNo);
    log.info(group + "!!!!!!!!!!");
    return group.map(Group::getGroupJoin).orElse(-1); // -1을 사용하여 그룹에 가입하지 않은 상태를 표시
  }

  public boolean isLeader(String userId, Integer studyNo) {
    Optional<Group> group = groupRepository.findByUserIdAndStudyNoAndGroupLeader(userId, studyNo, 1);
    log.info(group.isPresent() + "!!!");
    return group.isPresent();
  }

  public boolean confirmGroupJoin(Integer groupNo, boolean approve) { // 그룹 가입 승인,거절(방장)
    Optional<Group> groupOpt = groupRepository.findById(groupNo);
    if (groupOpt.isPresent()) {
      Group group = groupOpt.get();
      group.setGroupJoin(approve ? 1 : 2);
      groupRepository.save(group);
      return true;
    } else {
      return false;
    }
  }

  public List<GroupRequestDTO> getPendingGroupRequestsByStudyNo(Integer studyNo) { // 그룹 가입 요청 목록 조회
    List<Group> groups = groupRepository.findByStudyNoAndGroupJoin(studyNo, 0);
    return groups.stream() // 닉네임 반환을 위한 테이블 조인
        .map(group -> {
          Optional<User> userOpt = userRepository.findByUserId(group.getUserId());
          String userNick = userOpt.map(User::getUserNick).orElse("Unknown");
          return new GroupRequestDTO(
              group.getGroupNo(),
              group.getUserId(),
              userNick,
              group.getStudyNo(),
              group.getGroupLeader(),
              group.getGroupJoin());
        })
        .collect(Collectors.toList());
  }

  public int getCurrentMemberCount(Integer studyNo) { // 현재 가입 인원 가져오기
    List<Group> currentMembers = groupRepository.findByStudyNoAndGroupJoin(studyNo, 1); // 승인된 인원만 체크
    return currentMembers.size();
  }

}
