package com.swit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swit.domain.User;

public interface AdminRepository extends JpaRepository<User, Integer> {  
    // 시큐리티 적용 후 jpa/JPQL 생성이 되지 않아 주석처리함
    // 다른 방법으로 처리 필요
    // @Query("SELECT u FROM User u ORDER BY u.user_id DESC")
    // Page<User> findAllUsers(Pageable pageable);
    
}
