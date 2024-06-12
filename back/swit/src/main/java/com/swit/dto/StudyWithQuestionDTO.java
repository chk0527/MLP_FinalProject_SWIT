package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StudyWithQuestionDTO {
    private StudyDTO study;
    private QuestionDTO question;
}
