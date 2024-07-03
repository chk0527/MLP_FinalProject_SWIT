package com.swit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

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

    Optional<User> findByUserId(String userId);
    Optional<User> findByUserNick(String userNick);

    // 네이버 로그인 체크
    // 아이디/비밀번호 찾기 확인 처리(이메일, 핸드폰번호)
    Optional<User> findByUserNameAndUserEmailAndUserSnsConnect(String userName, String userEmail, String userSnsConnect);
    Optional<User> findByUserNameAndUserPhoneAndUserSnsConnect(String userName, String userPhone, String userSnsConnect);
    Optional<User> findByUserIdAndUserNameAndUserEmailAndUserSnsConnect(String userId, String userName, String userEmail, String userSnsConnect);
    Optional<User> findByUserIdAndUserNameAndUserPhoneAndUserSnsConnect(String userId, String userName, String userPhone, String userSnsConnect);
    Boolean existsByUserNameAndUserEmailAndUserSnsConnect(String userName, String userEmail, String userSnsConnect);

    // 카카오 로그인 체크    
    Optional<User> findByUserNickAndUserEmailAndUserSnsConnect(String userNick, String userEmail, String userSnsConnect);
    Boolean existsByUserNickAndUserEmailAndUserSnsConnect(String userNick, String userEmail, String userSnsConnect);

    //수정 시 중복 체크
    List<User> findUsersByUserNick(String userNick);
    List<User> findUsersByUserPhone(String userPhone);
    List<User> findUsersByUserEmail(String userEmail);

}