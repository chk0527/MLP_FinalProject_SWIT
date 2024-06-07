package com.swit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swit.domain.User;

public interface AdminRepository extends JpaRepository<User, String> {  

    // Security 적용 후 Spring boot 기동시 에러가 납니다.
    // 다른 방법으로 구현해야 합니다.
    // @Query("SELECT u FROM User u ORDER BY u.user_id DESC")
    // Page<User> findAllUsers(Pageable pageable);

    
}
