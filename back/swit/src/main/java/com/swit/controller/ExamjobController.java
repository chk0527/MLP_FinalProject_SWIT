package com.swit.controller;

import org.springframework.web.bind.annotation.RestController;


import com.swit.dto.ExamDTO;
import com.swit.dto.FavoritesExamDTO;
import com.swit.dto.JobDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.service.ExamjobService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/examjob")
public class ExamjobController {

    private final ExamjobService service;

    @GetMapping("/examlist")
    public PageResponseDTO<ExamDTO> ExamList(PageRequestDTO pageRequestDTO, @RequestParam(value="searchKeyword", required = false) String searchKeyword){
        if(searchKeyword != null){ // 검색어가 있을 경우
            return service.examSearch(pageRequestDTO, searchKeyword);
        }
        return service.examList(pageRequestDTO);
    }

    @GetMapping("/joblist")
    public PageResponseDTO<JobDTO> JobList(PageRequestDTO pageRequestDTO,
                                           @RequestParam(value = "searchKeyword", required = false) String searchKeyword,
                                           @RequestParam(value = "jobField", required = false) String jobField,
                                           @RequestParam(value = "sort", required = false, defaultValue = "jobNo") String sort) {
        return service.jobList(pageRequestDTO, searchKeyword, jobField, sort);
    }

    @GetMapping("/exam/{examNo}")
    public ExamDTO examRead(@PathVariable(name="examNo")Integer examNo) {
        return service.examRead(examNo);
    }

    @GetMapping("/job/{jobNo}")
    public JobDTO jobRead(@PathVariable(name="jobNo")Integer jobNo) {
        return service.jobRead(jobNo);
    }

    @GetMapping("/examAll") // 모든정보 들고오는거 -> 달력
    public List<ExamDTO> examAll(@RequestParam(value="searchKeyword", required = false) String searchKeyword) {
       if(searchKeyword != null){ // 검색어 있을때
        return service.examSearchAll(searchKeyword);
       }
       return service.examAll();
    }

    //시험즐겨찾기기능
    @PostMapping("/exam/favorites")
    public ResponseEntity<?> addExamFavorite(@RequestBody FavoritesExamDTO favoritesExamDTO) {

        

        try {
            boolean success = service.addFavorite(favoritesExamDTO.getUserId(), favoritesExamDTO.getExamNo());
            if (success) {
                return ResponseEntity.ok("즐겨찾기 추가됨");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("즐겨찾기에 존재함");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("addExamFavorite 에러" + e.getMessage());
        }
    }

    @DeleteMapping("/exam/favorites")
    public ResponseEntity<?> removeExamFavorite(@RequestBody FavoritesExamDTO favoritesExamDTO) {
        try {
            boolean success = service.removeFavorite(favoritesExamDTO.getUserId(), favoritesExamDTO.getExamNo());
            if (success) {
                return ResponseEntity.ok("즐겨찾기에서 삭제");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("즐겨찾기에 없음");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("removeFavorite에러" + e.getMessage());
        }
    }

    @GetMapping("/exam/favorites")
    public ResponseEntity<?> isExamFavorite(@RequestParam(value = "userId") String userId, @RequestParam(value = "examNo") Integer examNo) {
        try {
            boolean isFavorite = service.isFavorite(userId, examNo);
            return ResponseEntity.ok(isFavorite);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("isFavorite에러" + e.getMessage());
        }
    }
 
    
      



}
