package com.swit.domain;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) // Auditing 기능을 포함 - CreatedDate
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키
  @Column(unique = true, nullable = false)
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

  private boolean userDeleteChk; // true(1) : 정상 , false(0) : 탈퇴
  private LocalDateTime userDeleteDate;

  private String userRole;
}