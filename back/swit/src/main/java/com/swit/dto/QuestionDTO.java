package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Integer studyNo;
    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;
}
