package com.swit.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyDTO {
    private Integer studyNo;
    private String studyTitle;
    private String studyContent;
    private String studyType;
    private LocalDate studyStartDate;
    private LocalDate studyEndDate;
    private Integer studyHeadcount;
    private Boolean studyOnlineChk;
    private String studySubjeck;
    private String studyComm;
    private String studyLink;
}
