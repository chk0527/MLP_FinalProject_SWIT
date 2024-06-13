package com.swit.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.swit.domain.Group;
import com.swit.domain.User;
import com.swit.dto.CustomUserDetails;
import com.swit.dto.GroupDTO;
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

  public Integer register(GroupDTO groupDTO) {
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

  public boolean isMember(String userId, Integer studyNo) {
    return groupRepository.existsByUserUserIdAndStudyStudyNo(userId, studyNo);
  }
}
