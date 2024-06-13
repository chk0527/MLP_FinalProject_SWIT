package com.swit.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.swit.domain.Job;

@Repository
public interface JobRepository extends JpaRepository<Job,Integer>{
    Page<Job> findByJobTitleContainingAndJobActive(String searchKeyword, int jobActive, Pageable pageable);//제목만 검색?

    Page<Job> findByJobFieldContainingAndJobTitleContainingAndJobActive(String jobField, String searchKeyword, int jobActive, Pageable pageable);

    List<Job> findByJobDeadlineBeforeAndJobActive(LocalDate jobDeadline, int jobActive);// jobActive 변경

    Page<Job> findByJobActive(int jobActive, Pageable pageable);
}
