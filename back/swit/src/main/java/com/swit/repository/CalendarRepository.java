package com.swit.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.Calendar;

public interface CalendarRepository extends JpaRepository<Calendar, Integer> {
    @Query("SELECT c FROM Calendar c WHERE c.study.studyNo = :studyNo")
    List<Calendar> findByStudyNo(@Param("studyNo") Integer studyNo);
}
