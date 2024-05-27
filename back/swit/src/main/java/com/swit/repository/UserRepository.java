package com.swit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.User;

public interface UserRepository extends JpaRepository<User, String> {

    //user_ID의 마이페이지 프로필 정보 표시
    @Query("select u from User u where u.user_id = :user_id")
    Optional<User> selectOne(@Param("user_id") String user_id);
}