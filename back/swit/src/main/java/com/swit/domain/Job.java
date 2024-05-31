package com.swit.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "job")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jobNo;
    @Column(length = 2000)
    private String jobTitle;
    @Column(length = 1000)
    private String jobCompany;
    @Column(length = 100)
    private String jobField;
    @Column(length = 200)
    private String jobLoc;
    private LocalDate jobDeadline;
    private Integer jobActive; // 0:마감, 1:진행중
    @Column(length = 40)
    private String jobExperience;
    @Column(length = 50)
    private String jobType;
    @Column(length = 4000)
    private String jobUrl;
}
