package com.swit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.swit.domain.Answer;
import com.swit.domain.Study;
import com.swit.domain.User;
import com.swit.repository.AnswerRepository;
import com.swit.repository.StudyRepository;
import com.swit.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;

     public List<Answer> getAnswers(String userId, Integer studyNo) {
      User user = userRepository.findByUserId(userId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + userId));
        Study study = studyRepository.findById(studyNo).orElseThrow(() -> new IllegalArgumentException("Invalid study ID"));
        log.info(answerRepository.findByUserAndStudy(user, study)+"@@@@@");
        return answerRepository.findByUserAndStudy(user, study);
    }
}
