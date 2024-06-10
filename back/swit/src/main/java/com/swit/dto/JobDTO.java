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
public class JobDTO {
    private Integer jobNo;
    private String jobTitle;
    private String jobCompany;
    private String jobField;
    private String jobLoc;
    private LocalDate jobDeadline;
    private Integer jobActive; // 0:마감, 1:진행중
    private String jobExperience;
    private String jobType;
    private String jobUrl;

}
