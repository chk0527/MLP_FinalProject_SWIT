package com.swit.service;

import com.swit.domain.Question;
import com.swit.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class QuestionService {
    private final QuestionRepository questionRepository;

    public Question getQuestionsByStudyNo(Integer studyNo) {
        return questionRepository.findByStudyNo(studyNo);
    }
}
