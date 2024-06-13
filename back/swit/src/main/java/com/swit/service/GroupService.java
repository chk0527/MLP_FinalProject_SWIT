package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.swit.domain.Group;
import com.swit.domain.User;
import com.swit.dto.CustomUserDetails;
import com.swit.dto.GroupDTO;
import com.swit.dto.GroupRequestDTO;
import com.swit.repository.GroupRepository;
import com.swit.repository.UserRepository;

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

  public List<Group> getAllGroups() {
    return groupRepository.findAll();
  }

  public Integer register(GroupDTO groupDTO) { //그룹 가입
    Group group = modelMapper.map(groupDTO, Group.class);
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication.getPrincipal() instanceof CustomUserDetails) {
      CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
      String userId = userDetails.getUsername();
      
      Optional<User> user = userRepository.findByUserId(userId);
      group.setUser(user.get());
      
    } else {
      throw new IllegalStateException("Authentication principal is not an instance of CustomUserDetails");
    }
    Group saveGroup = groupRepository.save(group);
    return saveGroup.getGroupNo();
  }

  public Integer isMember(String userId, Integer studyNo) { //그룹 가입 승인 여부 판별
    Optional<Group> group = groupRepository.findByUserUserIdAndStudyStudyNo(userId, studyNo);
    log.info(userId + "@@@@@@@" + studyNo);
    log.info(group + "!!!!!!!!!!");
    return group.map(Group::getGroupJoin).orElse(-1); // -1을 사용하여 그룹에 가입하지 않은 상태를 표시
  }

  public boolean isLeader(String userId, Integer studyNo) {
    Optional<Group> group = groupRepository.findByUserUserIdAndStudyStudyNoAndGroupLeader(userId, studyNo, 1);
    log.info(group.isPresent()+"!!!");
    return group.isPresent();
  }

  public boolean confirmGroupJoin(Integer groupNo, boolean approve) { //그룹 가입 승인,거절(방장)
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

  public List<GroupRequestDTO> getPendingGroupRequestsByStudyNo(Integer studyNo) { //그룹 가입 요청 목록 조회
    List<Group> groups = groupRepository.findByStudyStudyNoAndGroupJoin(studyNo, 0);
    return groups.stream() //닉네임 반환을 위한 테이블 조인
        .map(group -> {
          Optional<User> userOpt = userRepository.findByUserId(group.getUser().getUserId());
          String userNick = userOpt.map(User::getUserNick).orElse("Unknown");
          return new GroupRequestDTO(
              group.getGroupNo(),
              group.getUser().getUserId(),
              userNick,
              group.getStudy().getStudyNo(),
              group.getGroupLeader(),
              group.getGroupJoin(),
              group.getGroupSelfintro());
        })
        .collect(Collectors.toList());
  }
}
