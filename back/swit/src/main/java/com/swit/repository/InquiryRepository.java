package com.swit.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Inquiry;

public interface InquiryRepository extends JpaRepository<Inquiry, Integer> {
    List<Inquiry> findByStudyStudyNo(Integer studyNo);

    Page<Inquiry> findByUserUserId(String userId, Pageable pageable);
}
