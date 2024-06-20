package com.swit.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.FavoritesJob;
import com.swit.domain.Job;
import com.swit.domain.User;

public interface FavoritesJobRepository extends JpaRepository<FavoritesJob, Long> {

    boolean existsByUserAndJob(User user, Job job);
    void deleteByUserAndJob(User user, Job job);
}
