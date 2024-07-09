package com.swit.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "answer")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer answerNo;

    @ManyToOne
    @JoinColumn(name = "studyNo", nullable = false)
    private Study study;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false) // userId 컬럼과 매핑
    private User user;

    private String a1;
    private String a2;
    private String a3;
    private String a4;
    private String a5;
    private String Selfintro; // 자기소개(한마디)
}
