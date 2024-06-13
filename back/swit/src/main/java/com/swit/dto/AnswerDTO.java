package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {
    private Integer studyNo;
    private String userId;
    private String a1;
    private String a2;
    private String a3;
    private String a4;
    private String a5;
    private String Selfintro; // 자기소개(한마디)
}
