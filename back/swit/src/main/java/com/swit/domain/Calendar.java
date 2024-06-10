package com.swit.domain;

import java.time.LocalDateTime;

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
@Table(name = "calendar")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Calendar {
    // Auto-Increment
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer calendarNo;

    //Study 테이블에서 studyID 외래키 조인
    @ManyToOne
    @JoinColumn(name = "studyNo", nullable = false)
    private Study study;  

    @Column(length = 8000)
    private String content;

    private String title;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endDate;
    private boolean completeChk;    //일정 완료 여부
    private String color;           //일정 색상
}
