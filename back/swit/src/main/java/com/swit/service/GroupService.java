package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.swit.dto.UserDTO;
import com.swit.repository.AnswerRepository;
import com.swit.repository.GroupMemberProjection;
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
  private final AnswerRepository answerRepository;

  @Autowired
    public GroupService(GroupRepository groupRepository, UserRepository userRepository, AnswerRepository answerRepository, ModelMapper modelMapper) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.answerRepository = answerRepository;
        this.modelMapper = modelMapper;
    }

  public List<Group> getAllGroups() {
    return groupRepository.findAll();
  }

  public Integer register(GroupDTO groupDTO) {
    Group group = modelMapper.map(groupDTO, Group.class);
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication.getPrincipal() instanceof CustomUserDetails) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String userId = userDetails.getUsername();

        // User를 데이터베이스에서 조회합니다.
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isPresent()) {
            group.setUser(userOpt.get());
        } else {
            throw new IllegalStateException("User not found with userId: " + userId);
        }

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
      
      Optional<User> userOpt = userRepository.findByUserId(userId);
      if (userOpt.isPresent()) {
          User user = userOpt.get();
          group.setUser(user);
          group.setStudy(new Study(groupDTO.getStudyNo())); // Study 객체 생성 및 설정
      } else {
          throw new IllegalStateException("User not found: " + userId);
      }
  } else {
      throw new IllegalStateException("Authentication principal is not an instance of CustomUserDetails");
  }
  Group savedGroup = groupRepository.save(group);

  Answer answer = modelMapper.map(answerDTO, Answer.class);
  answer.setUser(savedGroup.getUser());
  answer.setStudy(savedGroup.getStudy());
  answerRepository.save(answer);

  return savedGroup.getGroupNo();
}
  // public Integer registerWithAnswer(GroupDTO groupDTO, AnswerDTO answerDTO) {
  //   Group group = modelMapper.map(groupDTO, Group.class);

  //   Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
  //   if (authentication.getPrincipal() instanceof CustomUserDetails) {
  //     CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
  //     String userId = userDetails.getUsername();
  //     group.setUserId(userId);
  //     answerDTO.setUserId(userId);
  //   } else {
  //     throw new IllegalStateException("Authentication principal is not an instance of CustomUserDetails");
  //   }
  //   Group savedGroup = groupRepository.save(group);

  //   Answer answer = modelMapper.map(answerDTO, Answer.class);

  //   // Study 객체를 데이터베이스에서 조회하여 Answer에 설정
  //   Study study = studyRepository.findById(groupDTO.getStudyNo())
  //       .orElseThrow(() -> new IllegalArgumentException("Study not found: " + groupDTO.getStudyNo()));
  //   answer.setStudy(study);

  //   // User를 데이터베이스에서 조회하여 Answer에 설정
  //   User user = userRepository.findByUserId(answerDTO.getUserId())
  //       .orElseThrow(() -> new IllegalArgumentException("User not found: " + answerDTO.getUserId()));
  //   answer.setUser(user);

  //   answerRepository.save(answer);

  //   return savedGroup.getGroupNo();
  // }

  

  public Integer isMember(String userId, Integer studyNo) { // 그룹 가입 승인 여부 판별
    Optional<Group> group = groupRepository.findByUserUserIdAndStudyStudyNo(userId, studyNo);
    log.info(userId + "@@@@@@@" + studyNo);
    log.info(group + "!!!!!!!!!!");
    return group.map(Group::getGroupJoin).orElse(-1); // -1을 사용하여 그룹에 가입하지 않은 상태를 표시
  }

  public boolean isLeader(String userId, Integer studyNo) {
    Optional<Group> group = groupRepository.findByUserUserIdAndStudyStudyNoAndGroupLeader(userId, studyNo, 1);
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
    List<Group> groups = groupRepository.findByStudyStudyNoAndGroupJoin(studyNo, 0);
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
    List<Group> currentMembers = groupRepository.findByStudyStudyNoAndGroupJoin(studyNo, 1); // 승인된 인원만 체크
    return currentMembers.size();
  }

    public List<GroupMemberProjection> getGroupMembers(Integer studyNo) { //현재 가입 인원 정보 가져오기
        return groupRepository.findGroupMembersByStudyNo(studyNo);
    }

    public boolean expelMember(String userId, Integer studyNo) {
      Optional<Group> group = groupRepository.findByUserUserIdAndStudyStudyNo(userId, studyNo);
      if (group.isPresent()) {
          Group groupEntity = group.get();
          groupEntity.setGroupJoin(3); // 추방된 상태를 나타내는 값으로 설정
          groupRepository.save(groupEntity);
          return true;
      }
      return false;
  }

}