package com.swit.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.PlaceDTO;
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

    @GetMapping("/list")
    public PageResponseDTO<PlaceDTO> getPlaceList(PageRequestDTO pageRequestDTO) {
        log.info(pageRequestDTO);
        return service.getPlaceList(pageRequestDTO);
    }
}
