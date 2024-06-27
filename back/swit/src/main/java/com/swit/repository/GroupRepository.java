package com.swit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.Group;

public interface GroupRepository extends JpaRepository<Group, Integer> {
  List<Group> findByStudyStudyNoAndGroupJoin(Integer studyNo, Integer groupJoin); // 새로운 메소드 추가

  Optional<Group> findByUserUserIdAndStudyStudyNo(String userId, Integer studyNo); // studyNo값을 가지는 유저 정보 가져옴

  Optional<Group> findByUserUserIdAndStudyStudyNoAndGroupLeader(String userId, Integer studyNo, Integer groupLeader); // 그룹장
                                                                                                                      // 여부
                                                                                                                      // 판별(리더
                                                                                                                      // 정보가
                                                                                                                      // 1인
                                                                                                                      // 값만
                                                                                                                      // 가져옴)

  @Query("SELECT g.groupJoin as groupJoin, g.groupLeader as groupLeader, u.userId as userId, u.userNick as userNick, u.userEmail as userEmail, u.userCreateDate as userCreateDate "
      +
      "FROM Group g JOIN g.user u WHERE g.study.studyNo = :studyNo")
  List<GroupMemberProjection> findGroupMembersByStudyNo(@Param("studyNo") Integer studyNo);
}
