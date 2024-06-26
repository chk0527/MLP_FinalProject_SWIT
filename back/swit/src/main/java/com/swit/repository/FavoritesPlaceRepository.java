package com.swit.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.FavoritesPlace;
import com.swit.domain.Place;
import com.swit.domain.User;

public interface FavoritesPlaceRepository extends JpaRepository<FavoritesPlace, Long> {

    boolean existsByUserAndPlace(User user, Place place);
    void deleteByUserAndPlace(User user, Place place);
}
