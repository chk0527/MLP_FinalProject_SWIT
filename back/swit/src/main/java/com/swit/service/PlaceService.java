package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.swit.domain.FavoritesJob;
import com.swit.domain.FavoritesPlace;
import com.swit.domain.Place;
import com.swit.domain.User;
import com.swit.dto.JobDTO;
import com.swit.dto.PlaceDTO;
import com.swit.repository.FavoritesPlaceRepository;
import com.swit.repository.PlaceRepository;
import com.swit.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PlaceService {
        private final ModelMapper modelMapper;
        private final UserRepository userRepository;
        private final PlaceRepository placeRepository;
        private final FavoritesPlaceRepository favoritesPlaceRepository;

        // place 하나
        public PlaceDTO getPlace(Long place_no) {
                Optional<Place> result = placeRepository.findById(place_no);
                Place place = result.orElseThrow();
                PlaceDTO placeDto = modelMapper.map(place, PlaceDTO.class);
                return placeDto;
        }

        // 스터디 맵에 쓸 전체 리스트
        public List<Place> getPlaceAllList() {
                return placeRepository.findAll();
        }

        // 즐겨찾기
        @Transactional
        public boolean addFavorite(String userId, Long placeNo) {

                User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Usr못찾으"));
                Place place = placeRepository.findById(placeNo).orElseThrow(() -> new RuntimeException("Place못찾음"));

                if (!favoritesPlaceRepository.existsByUserAndPlace(user, place)) {
                        FavoritesPlace favoritesPlace = new FavoritesPlace();
                        favoritesPlace.setUser(user);
                        favoritesPlace.setPlace(place);
                        favoritesPlaceRepository.save(favoritesPlace);
                        return true;
                }
                return false;

        }

        @Transactional
        public boolean removeFavorite(String userId, Long placeNo) throws Exception {
                try {
                        User user = userRepository.findByUserId(userId)
                                        .orElseThrow(() -> new RuntimeException("Usr못찾으2"));
                        Place place = placeRepository.findById(placeNo).orElseThrow(() -> new RuntimeException("Place못찾음2"));

                        if (favoritesPlaceRepository.existsByUserAndPlace(user, place)) {
                                favoritesPlaceRepository.deleteByUserAndPlace(user, place);
                                return true;
                        }
                        return false;
                } catch (Exception e) {
                        throw new Exception("즐겨찾기삭제에러", e);
                }
        }

        @Transactional
        public boolean isFavorite(String userId, Long placeNo) throws Exception {
                try {
                        User user = userRepository.findByUserId(userId)
                                        .orElseThrow(() -> new RuntimeException("Usr못찾으3"));
                        Place place = placeRepository.findById(placeNo).orElseThrow(() -> new RuntimeException("Place못찾음3"));
                        return favoritesPlaceRepository.existsByUserAndPlace(user, place);
                } catch (Exception e) {
                        throw new Exception("ifFavorite에러", e);
                }
        }

        // 즐겨찾기된 채용 목록 가져오기
        public List<PlaceDTO> getFavoritePlaces(String userId) throws Exception {
                try {
                        User user = userRepository.findByUserId(userId)
                                        .orElseThrow(() -> new RuntimeException("user못찾음"));
                        List<FavoritesPlace> favoritePlaces = favoritesPlaceRepository.findByUser(user);
                        return favoritePlaces.stream()
                                        .map(favPlace -> modelMapper.map(favPlace.getPlace(), PlaceDTO.class))
                                        .collect(Collectors.toList());
                } catch (Exception e) {
                        throw new Exception("getPlaceFavorite에러", e);
                }
        }

        //메인 -> 장소추천
       
}
