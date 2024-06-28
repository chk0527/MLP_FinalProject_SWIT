package com.swit.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user", indexes = {
  @Index(name = "idx_user_nick", columnList = "userNick")
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) // Auditing 기능을 포함 - CreatedDate
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키
  @Column(name = "user_no")
  private Integer userNo;

  @Column(unique = true, nullable = true)
  private String userId;

  private String userEmail;
  private String userName;
  private String userPassword;
  private String userPhone;
  private String userNick;
  private String userSnsConnect;
  private String userImage;

  @CreatedDate // Entity 생성시 일자 자동 저장
  private LocalDateTime userCreateDate;

  private boolean userDeleteChk; // false(0) : 정상 , true(1) : 탈퇴
  private LocalDateTime userDeleteDate;

  private String userRole;

    // 추가된 메서드들
    public String getUserId() {
      return userId;
  }

  public void setUserId(String userId) {
      this.userId = userId;
  }
}