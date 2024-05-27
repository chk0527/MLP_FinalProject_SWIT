package com.swit.swit.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

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
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDate studyStartDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDate studyEndDate;
    private Integer studyHeadcount;
    private Boolean studyOnlineChk;
    private String studySubject;
    private String studyComm;
    private String studyLink;
}
