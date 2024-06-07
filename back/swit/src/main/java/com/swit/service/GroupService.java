package com.swit.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.swit.repository.GroupRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import com.swit.domain.Group;
import com.swit.dto.GroupDTO;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class GroupService {
  private final ModelMapper modelMapper;
  private final GroupRepository groupRepository;
  
  public List<Group> getAllGroups(){
    return groupRepository.findAll();
  }

  public Integer register(GroupDTO groupDTO){
    Group group = modelMapper.map(groupDTO, Group.class);
    Group saveGroup = groupRepository.save(group);

    return saveGroup.getGroupNo();
  }
}

