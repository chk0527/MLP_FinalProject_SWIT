package com.swit.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.Study;

public interface StudyRepository extends JpaRepository<Study, Integer> {
        // 스터디 이미지 조인 && 검색 && 전체 목록
        @Query(value = "SELECT * FROM (" +
                        "    WITH RankedStudies AS (" +
                        "        SELECT s.*, si.file_name, g.group_leader, g.group_join, g.user_id AS id, " +
                        "        ROW_NUMBER() OVER (PARTITION BY s.study_no " +
                        "            ORDER BY CASE WHEN g.group_leader = 1 AND g.user_id = :userId THEN 1 " +
                        "            WHEN g.group_join = 1 AND g.user_id = :userId THEN 2 " +
                        "            WHEN g.group_join = 0 AND g.user_id = :userId THEN 3 " +
                        "            ELSE 4 END) AS rn " +
                        "        FROM study s " +
                        "        LEFT JOIN study_image_list si ON si.study_study_no = s.study_no " +
                        "        LEFT JOIN group1 g ON g.study_no = s.study_no " +
                        "        WHERE s.study_title LIKE %:studyTitle% AND s.study_subject LIKE %:studySubject% " +
                        "        AND s.study_addr LIKE %:studyAddr% " +
                        // "        AND s.study_online = :studyOnline" +
                        "        AND (:studyOnline IS NULL OR s.study_online = :studyOnline)" +
                        "    ) " +
                        "    SELECT * FROM RankedStudies WHERE rn = 1 " +
                        ") AS FinalResults " +
                        "ORDER BY " +
                        "    CASE WHEN group_leader = 1 AND id = :userId THEN 1 " +
                        "    WHEN group_join = 1 AND id = :userId THEN 2 " +
                        "    WHEN group_join = 0 AND id = :userId THEN 3 " +
                        "    ELSE 4 END", countQuery = "SELECT COUNT(*) FROM (" +
                                        "    WITH RankedStudies AS (" +
                                        "        SELECT s.*, si.file_name, g.group_leader, g.group_join, g.user_id AS id, "
                                        +
                                        "        ROW_NUMBER() OVER (PARTITION BY s.study_no " +
                                        "            ORDER BY CASE WHEN g.group_leader = 1 AND g.user_id = :userId THEN 1 "
                                        +
                                        "            WHEN g.group_join = 1 AND g.user_id = :userId THEN 2 " +
                                        "            WHEN g.group_join = 0 AND g.user_id = :userId THEN 3 " +
                                        "            ELSE 4 END) AS rn " +
                                        "        FROM study s " +
                                        "        LEFT JOIN study_image_list si ON si.study_study_no = s.study_no " +
                                        "        LEFT JOIN group1 g ON g.study_no = s.study_no " +
                                        "        WHERE s.study_title LIKE %:studyTitle% AND s.study_subject LIKE %:studySubject% "
                                        +
                                        "        AND s.study_addr LIKE %:studyAddr% AND s.study_online = :studyOnline" +
                                        "    ) " +
                                        "    SELECT * FROM RankedStudies WHERE rn = 1 " +
                                        ") AS FinalResults", nativeQuery = true)
        Page<Study> studyList(@Param("studyTitle") String studyTitle,
                        @Param("studySubject") String studySubject,
                        @Param("studyAddr") String studyAddr,
                        @Param("studyOnline") Boolean studyOnline,
                        @Param("userId") String userId,
                        Pageable pageable);

        @Query(value = "SELECT s.* FROM study s LEFT JOIN group1 g ON g.study_no = s.study_no WHERE g.user_id = :userId AND g.group_join = 1", nativeQuery = true)
        List<Study> myStudy(String userId);

}
