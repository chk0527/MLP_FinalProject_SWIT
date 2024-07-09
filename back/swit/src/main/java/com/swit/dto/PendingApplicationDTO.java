package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingApplicationDTO {
    private Integer studyNo;
    private String studyTitle;
    private Long pendingCount;
}
