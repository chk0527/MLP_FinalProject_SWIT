package com.swit.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Data;

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
    @JoinColumn(name = "study_no", nullable = false)
    private Study study;
}