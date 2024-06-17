package com.swit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.Timer;

public interface TimerRepository extends JpaRepository<Timer, Integer> {
    @Query("SELECT t FROM Timer t WHERE t.study.studyNo = :studyNo")
    List<Timer> findByStudyNo(@Param("studyNo") Integer studyNo);
}
