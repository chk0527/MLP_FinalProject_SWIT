package com.swit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Group;

public interface GroupRepository extends JpaRepository<Group, Integer> {
  boolean existsByUserIdAndStudyNo(String userId, Integer studyNo);
  List<Group> findByStudyNoAndGroupJoin(Integer studyNo, Integer groupJoin); // 새로운 메소드 추가
  Optional<Group> findByUserIdAndStudyNo(String userId, Integer studyNo); //studyNo값을 가지는 유저 정보 가져옴
  Optional<Group> findByUserIdAndStudyNoAndGroupLeader(String userId, Integer studyNo, Integer groupLeader); //그룹장 여부 판별(리더 정보가 1인 값만 가져옴)
}
