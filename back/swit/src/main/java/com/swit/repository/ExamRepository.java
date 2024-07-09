package com.swit.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.swit.domain.Exam;


@Repository
public interface ExamRepository extends JpaRepository <Exam, Integer> {
      Page<Exam> findByExamTitleContaining(String searchKeyword, Pageable pageable);
      List<Exam> findByExamTitleContaining(String searchKeyword);
}
