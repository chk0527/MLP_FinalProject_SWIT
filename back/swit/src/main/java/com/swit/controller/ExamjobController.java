package com.swit.controller;

import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.ExamDTO;
import com.swit.dto.JobDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.service.ExamjobService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/examjob")
public class ExamjobController {

    private final ExamjobService service;

    @GetMapping("/examlist")
    public PageResponseDTO<ExamDTO> ExamList(PageRequestDTO pageRequestDTO){
        
        return service.examList(pageRequestDTO);
    }

    @GetMapping("/joblist")
    public PageResponseDTO<JobDTO> JobList(PageRequestDTO pageRequestDTO, @RequestParam(value="searchKeyword", required = false) String searchKeyword){
        if(searchKeyword != null){ // 검색어가 있을 경우
            return service.jobSearch(pageRequestDTO, searchKeyword);
        }
        return service.jobList(pageRequestDTO);
    }

    @GetMapping("/exam/{examNo}")
    public ExamDTO examRead(@PathVariable(name="examNo")Integer examNo) {
        return service.examRead(examNo);
    }

    @GetMapping("/job/{jobNo}")
    public JobDTO jobRead(@PathVariable(name="jobNo")Integer jobNo) {
        return service.jobRead(jobNo);
    }



}
