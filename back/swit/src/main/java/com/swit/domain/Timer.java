package com.swit.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

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

    // Study 테이블에서 studyNo 외래키 조인
    @ManyToOne
    @JoinColumn(name = "studyNo", nullable = false)
    private Study study;

    // User 테이블에서 userNo 외래키 조인
    // referencedColumnName 선언 안하면 자꾸 User의 PK를 가져오게 됨!!
    @ManyToOne
    @JoinColumn(name = "userNick", referencedColumnName = "userNick", nullable = false)
    private User user;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startAt;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime stopAt;

    private Integer elapsedTime;
    private Integer time;
    private String name;
    private boolean running;
}
