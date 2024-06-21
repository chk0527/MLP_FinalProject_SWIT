package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.swit.domain.Exam;
import com.swit.domain.FavoritesExam;
import com.swit.domain.User;

public interface FavoritesExamRepository extends JpaRepository<FavoritesExam, Long> {
    boolean existsByUserAndExam(User user, Exam exam);
    void deleteByUserAndExam(User user, Exam exam);
    List<FavoritesExam> findByUser(User user);

}
