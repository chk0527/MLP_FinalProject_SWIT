package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Question;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

}