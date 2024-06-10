package com.swit.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

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
    private String userId;
    private String studyTitle;
    private String studyContent;
    private String studyType;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate studyStartDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate studyEndDate;
    private Integer studyHeadcount;
    private Boolean studyOnline;
    private String studySubject;
    private String studyComm;
    private String studyLink;
    private String studyUuid;
    @Builder.Default
    private List<MultipartFile> files = new ArrayList<>(); //서버에 저장되는 실제 파일 데이터
    @Builder.Default
    private List<String> uploadFileNames = new ArrayList<>(); //데이터베이스에 저장될 파일 이름  
}
