package com.swit.swit.domain;

import java.time.LocalDate;

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
@Table(name = "study")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Study {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studyNo;
    private String studyTitle;
    private String studyContent;
    private String studyType;
    private LocalDate studyStartDate;
    private LocalDate studyEndDate;
    private Integer studyHeadcount;
    private Boolean studyOnlineChk;
    private String studySubject;
    private String studyComm;
    private String studyLink;
}
