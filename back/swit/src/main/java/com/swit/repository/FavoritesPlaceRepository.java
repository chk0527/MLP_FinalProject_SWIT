package com.swit.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.FavoritesPlace;
import com.swit.domain.Place;
import com.swit.domain.User;

public interface FavoritesPlaceRepository extends JpaRepository<FavoritesPlace, Long> {

    boolean existsByUserAndPlace(User user, Place place);
    void deleteByUserAndPlace(User user, Place place);
    List<FavoritesPlace> findByUser(User user);
}
