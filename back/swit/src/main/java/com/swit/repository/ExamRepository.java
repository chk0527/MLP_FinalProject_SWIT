package com.swit.repository;


import org.springframework.data.jpa.repository.JpaRepository;


import com.swit.domain.Exam;

public interface ExamRepository extends JpaRepository <Exam, Integer> {
}
