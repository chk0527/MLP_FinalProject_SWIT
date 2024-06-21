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
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @CreationTimestamp // 해당 필드를 현재 시각으로 "자동 설정"
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(nullable = false, updatable = false)
    private LocalDateTime startAt;

    @UpdateTimestamp // db에서 업데이트될 때마다, 해당 필드를 현재 시각으로 "자동 갱신"
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime stopAt;


    private Integer elapsedTime;
    private String time;
    private String name;
    private boolean running;
}
