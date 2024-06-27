package com.swit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Place;
import com.swit.dto.FavoritesPlaceDTO;
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

    // 스터디 맵에 쓸 전체 리스트
    @GetMapping("/all")
    public List<Place> getPlaceAllList() {
        List<Place> placeList = service.getPlaceAllList();
        return placeList;
    }

    //즐겨찾기
    //추가
    @PostMapping("/place/favorites")
    public ResponseEntity<?> addPlaceFavorite(@RequestBody FavoritesPlaceDTO favoritesPlaceDTO) {
        try {
            boolean success = service.addFavorite(favoritesPlaceDTO.getUserId(), favoritesPlaceDTO.getPlaceNo());
            if (success) {
                return ResponseEntity.ok("즐겨찾기 추가됨");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("즐겨찾기에 존재함");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("addPlaceFavorite 에러" + e.getMessage());
        }
    }
    //삭제
    @DeleteMapping("/place/favorites")
    public ResponseEntity<?> removePlaceFavorite(@RequestBody FavoritesPlaceDTO favoritesPlaceDTO) {
        try {
            boolean success = service.removeFavorite(favoritesPlaceDTO.getUserId(), favoritesPlaceDTO.getPlaceNo());
            if (success) {
                return ResponseEntity.ok("즐겨찾기에서 삭제");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("즐겨찾기에 없음");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("removeFavorite에러" + e.getMessage());
        }
    }
    //조회
    @GetMapping("/place/favorites")
    public ResponseEntity<?> isPlaceFavorite(@RequestParam(value = "userId") String userId, @RequestParam(value = "placeNo") Long placeNo) {
        try {
            boolean isFavorite = service.isFavorite(userId, placeNo);
            return ResponseEntity.ok(isFavorite);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("isFavorite에러" + e.getMessage());
        }
    }


}
