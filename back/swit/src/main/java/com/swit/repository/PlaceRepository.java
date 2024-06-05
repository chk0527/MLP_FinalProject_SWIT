package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swit.domain.Place;


public interface PlaceRepository extends JpaRepository<Place, Long> {
}
