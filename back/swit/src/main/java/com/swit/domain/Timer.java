package com.swit.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "timer")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Timer {
    // Auto-Increment
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer timerNo;

    // User 테이블에서 userNo 외래키 조인
    @ManyToOne
    @JoinColumn(name = "userNo", nullable = false)
    private User user;

    //Study 테이블에서 studyNo 외래키 조인
    @ManyToOne
    @JoinColumn(name = "studyNo", nullable = false)
    private Study study;

    @Column(length = 3000)
    private String content;

    private int time; // 타이머의 경우 설정된 시간(초), 스톱워치의 경우 경과 시간(밀리초)
    private boolean running;
    
    @CreationTimestamp  // 해당 필드를 현재 시각으로 "자동 설정"
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp  // db에서 업데이트될 때마다, 해당 필드를 현재 시각으로 "자동 갱신" 
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime updatedAt;

    private String title;
    private String type;
}
