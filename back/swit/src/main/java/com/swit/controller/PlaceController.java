package com.swit.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Place;
import com.swit.dto.PlaceDTO;
import com.swit.dto.PlacePageRequestDTO;
import com.swit.dto.PlacePageResponseDTO;
import com.swit.service.PlaceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/place")
public class PlaceController {
    private final PlaceService service;

    @GetMapping("/{placeNo}")
    public PlaceDTO getPlace(@PathVariable(name = "placeNo") Long placeNo) {
        return service.getPlace(placeNo);
    }

    @GetMapping("/mapList")
    public PlacePageResponseDTO<PlaceDTO> getPlaceList(PlacePageRequestDTO
    pageRequestDTO) {
    log.info(pageRequestDTO);
    return service.getPlaceList(pageRequestDTO);
    }

    // 스터디 맵에 쓸 전체 리스트
    @GetMapping("/all")
    public List<Place> getPlaceAllList() {
        List<Place> placeList = service.getPlaceAllList();
        return placeList;
    }

    // 스터디 장소 표시할 리스트
    @GetMapping("/list")
    public PlacePageResponseDTO<PlaceDTO> getPlaceSearch(String placeName, String placeAddr,
            PlacePageRequestDTO pageRequestDTO) {
        log.info(pageRequestDTO);
        return service.getPlaceSearch(placeName, placeAddr, pageRequestDTO);
    }
}
