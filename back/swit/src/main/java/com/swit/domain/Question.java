package com.swit.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
public class Question {
    @Id
    private Integer studyNo;
    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;

    @OneToOne
    @MapsId
    @JsonBackReference
    @JoinColumn(name = "study_no", nullable = false)
    @ToString.Exclude // 순환 참조 방지
    private Study study;
}