package com.swit.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.swit.domain.Confirm;

public interface ConfirmRepository extends JpaRepository<Confirm, Integer> {
    
    Boolean existsByUserIdAndConfirmTargetAndConfirmPath(String UserId, String confirmTarget, String confirmPath);
    Optional<Confirm> findByUserIdAndConfirmTargetAndConfirmPath(String UserId, String confirmTarget, String confirmPath);
    
}