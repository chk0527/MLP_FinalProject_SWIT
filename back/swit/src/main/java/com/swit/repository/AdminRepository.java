package com.swit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swit.domain.User;

public interface AdminRepository extends JpaRepository<User, String> {  

    // @Query("SELECT u FROM User u ORDER BY u.user_id DESC")
    // Page<User> findAllUsers(Pageable pageable);
    // //Page<User> findByAllOrderByUserNoAsc(Pageable pageable);

    
}
