package com.swit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Group;

public interface GroupRepository extends JpaRepository<Group, Integer> {
  boolean existsByUserIdAndStudyNo(String userId, Integer studyNo);
  List<Group> findByStudyNoAndGroupJoin(Integer studyNo, Integer groupJoin); // 새로운 메소드 추가
  Optional<Group> findByUserIdAndStudyNo(String userId, Integer studyNo);
}
