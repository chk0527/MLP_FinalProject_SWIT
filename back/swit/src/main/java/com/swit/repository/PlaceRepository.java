package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.PlaceEntity;

public interface PlaceRepository extends JpaRepository<PlaceEntity, Long> {

}
