package com.swit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.Study;
import com.swit.domain.StudyImage;

public interface StudyRepository extends JpaRepository<Study, Integer> {
        // 스터디 이미지 조인 && 검색 && 전체 목록
        @Query(value = "select * from study s "
        + " left join study_image_list si on si.study_study_no=s.study_no"
        + " where s.study_title like %:studyTitle% and s.study_subject like %:studySubject% and"
        + " s.study_addr like %:studyAddr% and s.study_online = :studyOnline", nativeQuery =
        true)
        List<Study> studyList(@Param("studyTitle") String studyTitle,
        @Param("studySubject") String studySubject,
        @Param("studyAddr") String studyAddr,
        @Param("studyOnline") Boolean studyOnline);

}
