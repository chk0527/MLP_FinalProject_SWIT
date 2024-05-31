package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.User;

public interface UserRepository extends JpaRepository<User, String> {

    // //user_ID의 마이페이지 프로필 정보 표시
    // @Query("select u from User u where u.user_id = :user_id")
    // Optional<User> selectOne(@Param("user_id") String user_id);

    // //프로필 수정(모달창)
    // @Modifying
    // @Query("UPDATE User u SET u.userName = :userName, u.userNick = :userNick, u.userPhone = :userPhone, u.userEmail = :userEmail WHERE u.userId = :userId")
    // Optional<User> updateOne(@Param("userId") String userId, @Param("userName") String userName, @Param("userNick") String userNick, @Param("userPhone") String userPhone, @Param("userEmail") String userEmail);
}