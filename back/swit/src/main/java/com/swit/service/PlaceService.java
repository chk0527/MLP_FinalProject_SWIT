package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.swit.domain.Place;
import com.swit.dto.PlaceDTO;
import com.swit.dto.PlacePageRequestDTO;
import com.swit.dto.PlacePageResponseDTO;
import com.swit.repository.PlaceRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PlaceService {
        private final ModelMapper modelMapper;
        private final PlaceRepository placeRepository;

        // place 하나
        public PlaceDTO getPlace(Long place_no) {
                Optional<Place> result = placeRepository.findById(place_no);
                Place place = result.orElseThrow();
                PlaceDTO placeDto = modelMapper.map(place, PlaceDTO.class);
                return placeDto;
        }

        // place 전체 목록
        public PlacePageResponseDTO<PlaceDTO> getPlaceList(PlacePageRequestDTO pageRequestDTO) {
                Pageable pageable = PageRequest.of(
                                pageRequestDTO.getPlacePage() - 1, // 1페이지가 0
                                pageRequestDTO.getPlaceSize());

                Page<Place> result = placeRepository.findAll(pageable);
                List<PlaceDTO> placeList = result.getContent().stream()
                                .map(Place -> modelMapper.map(Place, PlaceDTO.class))
                                .collect(Collectors.toList());

                long totalCount = result.getTotalElements();
                PlacePageResponseDTO<PlaceDTO> responseDTO = PlacePageResponseDTO.<PlaceDTO>withAll()
                                .dtoList(placeList)
                                .pageRequestDTO(pageRequestDTO)
                                .totalCount(totalCount)
                                .build();
                return responseDTO;
        }

        //스터디 맵에 쓸 전체 리스트
        public List<Place> getPlaceAllList() {
                return placeRepository.findAll();
        }

        // 이름or지역 검색
        public PlacePageResponseDTO<PlaceDTO> getPlaceSearch(String placeName,
                        String placeAddr, PlacePageRequestDTO pageRequestDTO) {
                Pageable pageable = PageRequest.of(
                                pageRequestDTO.getPlacePage() - 1, // 1페이지가 0
                                pageRequestDTO.getPlaceSize());

                Page<Place> result = placeRepository.findByPlaceNameContainingAndPlaceAddrContaining(placeName,
                                placeAddr, pageable);
                List<PlaceDTO> placeList = result.getContent().stream()
                                .map(Place -> modelMapper.map(Place, PlaceDTO.class))
                                .collect(Collectors.toList());

                long totalCount = result.getTotalElements();
                PlacePageResponseDTO<PlaceDTO> responseDTO = PlacePageResponseDTO.<PlaceDTO>withAll()
                                .dtoList(placeList)
                                .pageRequestDTO(pageRequestDTO)
                                .totalCount(totalCount)
                                .build();
                return responseDTO;

        }
}
