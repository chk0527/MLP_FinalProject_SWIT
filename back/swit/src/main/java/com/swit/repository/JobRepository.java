package com.swit.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.swit.domain.Job;
import com.swit.dto.JobDTO;

@Repository
public interface JobRepository extends JpaRepository<Job,Integer>{
    Page<Job> findByJobTitleContaining(String searchKeyword, Pageable pageable);//제목만 검색?
}
