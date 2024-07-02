package com.swit.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.swit.domain.Confirm;

public interface ConfirmRepository extends JpaRepository<Confirm, Integer> {
    
    // Boolean existsByUserIdAndConfirmPath(String UserId, String confirmPath);
    // Optional<Confirm> findByUserIdAndConfirmPath(String UserId, String confirmPath);
    Boolean existsByUserId(String UserId);
    Optional<Confirm> findByUserId(String UserId);
    
}