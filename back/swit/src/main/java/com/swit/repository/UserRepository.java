package com.swit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.User;
// import com.swit.dto.UserDTO;
// import java.util.List;



public interface UserRepository extends JpaRepository<User, Integer> {

    // //user_ID의 마이페이지 프로필 정보 표시
    // @Query("select u from User u where u.user_id = :user_id")
    // Optional<User> selectOne(@Param("user_id") String user_id);

    // //프로필 수정(모달창)
    // @Modifying
    // @Query("UPDATE User u SET u.userName = :userName, u.userNick = :userNick, u.userPhone = :userPhone, u.userEmail = :userEmail WHERE u.userId = :userId")
    // Optional<User> updateOne(@Param("userId") String userId, @Param("userName") String userName, @Param("userNick") String userNick, @Param("userPhone") String userPhone, @Param("userEmail") String userEmail);

    Boolean existsByUserId(String userId);

    Boolean existsByUserNameAndUserEmailAndUserSnsConnect(String userName, String userEmail, String userSnsConnect);

    Optional<User> findByUserId(String userId);

    // 네이버 로그인 체크
    Optional<User> findByUserNameAndUserEmailAndUserSnsConnect(String userName, String userEmail, String userSnsConnect);
    // @Query("SELECT u FROM User u WHERE u.userName = :userName AND u.userEmail = :userEmail")
    // Optional<User> findByUserNameAndUserEmail(@Param("userName") String userName, @Param("userEmail") String userEmail);
    // 카카오 로그인 체크
    // Optional<User> findByUserNicKANDUserSnsConnect(String userNick, String userSnsConnect);

}