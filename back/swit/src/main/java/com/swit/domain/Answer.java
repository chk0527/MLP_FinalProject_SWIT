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
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    private String a1;
    private String a2;
    private String a3;
    private String a4;
    private String a5;
}