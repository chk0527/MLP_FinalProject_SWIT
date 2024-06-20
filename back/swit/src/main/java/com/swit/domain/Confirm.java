package com.swit.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "confirm")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)    
@JsonIgnoreProperties(value={"updatedDate"}, allowGetters=true)
public class Confirm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키
    private Integer confirmNo;
    @Column(unique = true, nullable = false)            // 홈페이지 가입회원 대상
    private String userId;
    private String confirmTarget;                       // "1" 아이디 "2" 패스워드
    private String confirmPath;                         // "1" 이메일 "2" 핸드폰
    private String confirmNum;                          // 난수 발생 6자리 숫자
    // @LastModifiedDate
    // @Column(name = "confirm_limit_date")
    private LocalDateTime confirmLimitDate;             
}
