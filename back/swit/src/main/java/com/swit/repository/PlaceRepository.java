package com.swit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Place;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    //검색
    Page<Place> findByPlaceNameContainingAndPlaceAddrContaining(String placeName, String placeAddr, Pageable pageable);

}
