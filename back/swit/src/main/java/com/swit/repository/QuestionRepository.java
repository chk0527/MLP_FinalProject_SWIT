package com.swit.repository;

import com.swit.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    Question findByStudyNo(Integer studyNo);
}
