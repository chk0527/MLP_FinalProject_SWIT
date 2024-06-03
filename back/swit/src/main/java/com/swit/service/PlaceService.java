package com.swit.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.swit.domain.Place;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.PlaceDTO;
import com.swit.repository.PlaceRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class PlaceService {
        private final ModelMapper modelMapper;
        private final PlaceRepository placeRepository;

        //place 하나
        public PlaceDTO getPlace(Long place_no) {
                Optional<Place> result = placeRepository.findById(place_no);
                Place place = result.orElseThrow();
                PlaceDTO placeDto = modelMapper.map(place, PlaceDTO.class);
                return placeDto;
        }

        //place 전체 목록
        public PageResponseDTO<PlaceDTO> getPlaceList(PageRequestDTO pageRequestDTO) {
                Pageable pageable = PageRequest.of(
                                pageRequestDTO.getPage() - 1, // 1페이지가 0
                                pageRequestDTO.getSize());

                Page<Place> result = placeRepository.findAll(pageable);
                List<PlaceDTO> placeList = result.getContent().stream()
                                .map(Place -> modelMapper.map(Place, PlaceDTO.class))
                                .collect(Collectors.toList());

                long totalCount = result.getTotalElements();
                PageResponseDTO<PlaceDTO> responseDTO = PageResponseDTO.<PlaceDTO>withAll()
                                .dtoList(placeList)
                                .pageRequestDTO(pageRequestDTO)
                                .totalCount(totalCount)
                                .build();
                return responseDTO;
        }
}
