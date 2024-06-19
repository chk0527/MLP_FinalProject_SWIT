package com.swit.controller;

import com.swit.domain.Question;
import com.swit.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping("/api/questions")
    public Question getQuestions(@RequestParam("studyNo") Integer studyNo) {
        return questionService.getQuestionsByStudyNo(studyNo);
    }
}
