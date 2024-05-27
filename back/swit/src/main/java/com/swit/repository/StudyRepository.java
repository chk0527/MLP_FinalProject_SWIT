package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Study;

public interface StudyRepository extends JpaRepository<Study, Integer> {

}
