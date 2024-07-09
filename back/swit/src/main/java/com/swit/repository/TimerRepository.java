package com.swit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Timer;

public interface TimerRepository extends JpaRepository<Timer, Integer> {
    @Query("SELECT t FROM Timer t WHERE t.study.studyNo = :studyNo")
    List<Timer> findByStudyNo(@Param("studyNo") Integer studyNo);

    @Query("SELECT t FROM Timer t WHERE t.study.studyNo = :studyNo AND t.user.userId = :userId")
    List<Timer> findByStudyUserId(@Param("studyNo") Integer studyNo, @Param("userId") String userId);

    @Query("SELECT t FROM Timer t WHERE t.study.studyNo = :studyNo AND t.user.userNick = :userNick")
    List<Timer> findByStudyUserNick(@Param("studyNo") Integer studyNo, @Param("userNick") String userNick);

    @Modifying
    @Transactional
    @Query("UPDATE Timer t SET t.user.userNick = :newUserNick WHERE t.user.userNick = :oldUserNick")
    void updateUserNick(@Param("oldUserNick") String oldUserNick, @Param("newUserNick") String newUserNick);

    @Modifying
    @Query("DELETE FROM Timer t WHERE t.study.studyNo = :studyNo")
    void deleteByStudyNo(@Param("studyNo") Integer studyNo);
}
