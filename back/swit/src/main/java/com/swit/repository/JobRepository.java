package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Job;

public interface JobRepository extends JpaRepository<Job,Integer>{

}
