package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class StudyPageRequestDTO {

    @Builder.Default
    private int StudyPage=1;
    @Builder.Default
    private int StudySize = 16;
}
