package com.swit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Group;

public interface GroupRepository extends JpaRepository<Group, Integer> {
  boolean existsByUserUserIdAndStudyStudyNo(String userId, Integer studyNo); // 해당 그룹에 해방 맴버 존재 여부
  List<Group> findByStudyStudyNoAndGroupJoin(Integer studyNo, Integer groupJoin); // 새로운 메소드 추가
  Optional<Group> findByUserUserIdAndStudyStudyNo(String userId, Integer studyNo); //studyNo값을 가지는 유저 정보 가져옴
  Optional<Group> findByUserUserIdAndStudyStudyNoAndGroupLeader(String userId, Integer studyNo, Integer groupLeader); //그룹장 여부 판별(리더 정보가 1인 값만 가져옴)
}
