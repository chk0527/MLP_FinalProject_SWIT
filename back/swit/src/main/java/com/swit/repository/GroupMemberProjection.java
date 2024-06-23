package com.swit.repository;

import java.time.LocalDateTime;

public interface GroupMemberProjection { //스터디에 가입된 그룹원의 정보를 가져오기 위한 인터페이스
  String getUserNick();
  String getUserEmail();
  LocalDateTime getUserCreateDate();
  Integer getGroupJoin();
  Integer getGroupLeader();
  String getUserId();
}
