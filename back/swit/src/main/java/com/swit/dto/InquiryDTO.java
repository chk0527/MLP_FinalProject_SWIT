package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InquiryDTO {
    private Integer inquiryNo;
    private String userId;
    private Integer studyNo;
    private String inquiryContent;
    private LocalDateTime inquiryTime;
    private String inquiryType;
    private String responseContent;
}
