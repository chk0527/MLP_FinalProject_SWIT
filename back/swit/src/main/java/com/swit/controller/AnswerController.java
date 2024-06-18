package com.swit.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Answer;
import com.swit.service.AnswerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/answers")
public class AnswerController {

    private final AnswerService answerService;

    @GetMapping
    public List<Answer> getAnswers(@RequestParam("userId") String userId, @RequestParam("studyNo") Integer studyNo) {
        return answerService.getAnswers(userId, studyNo);
    }
}
