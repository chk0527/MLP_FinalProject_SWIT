package com.swit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.swit.domain.Answer;
import com.swit.domain.Study;
import com.swit.domain.User;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Integer> {
  List<Answer> findByUserAndStudy(User user, Study study);
}
