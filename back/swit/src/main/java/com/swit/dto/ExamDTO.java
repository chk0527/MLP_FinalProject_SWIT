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
public class ExamDTO {
    private Integer examNo;
    private String examTitle;
    private String examDesc; // 자격구분
    
    //필기시험
    private LocalDate examDocStart;
    private LocalDate examDocEnd;

    //필기 접수
    private LocalDate examDocRegStart;
    private LocalDate examDogRegEnd;

    //실기시험
    private LocalDate examPracStart;
    private LocalDate examPracEnd;

    //실기접수
    private LocalDate examPracRegStart;
    private LocalDate examPracRegEnd;

    //합격일
    private LocalDate examDogPass;
    private LocalDate examPracPass;
}
