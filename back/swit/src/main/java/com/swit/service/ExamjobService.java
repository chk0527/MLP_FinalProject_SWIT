package com.swit.service;


import java.time.LocalDate;
import java.util.*;

import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import com.swit.domain.Exam;
import com.swit.domain.Job;
import com.swit.domain.User;
import com.swit.dto.ExamDTO;
import com.swit.dto.JobDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.repository.ExamRepository;

import com.swit.repository.JobRepository;
import com.swit.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class ExamjobService {
    private final ModelMapper modelMapper;
    private final ExamRepository examRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public PageResponseDTO<ExamDTO> examList(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                Sort.by("examPracRegEnd").descending());
        System.out.println("====================");
        System.out.println(pageable);

        Page<Exam> result = examRepository.findAll(pageable);
        List<ExamDTO> dtoList = result.getContent().stream()
                .map(exam -> modelMapper.map(exam, ExamDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<ExamDTO> responseDTO = PageResponseDTO.<ExamDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    // jobactive 설정 -> 날짜지나면 jobactive 0으로
    // @Scheduled(fixedRate = 43200000, initialDelay = 0) // 12시간마다
    // public void updateJobStatus() {
    //     LocalDate currentDate = LocalDate.now();
    //     List<Job> jobsToUpdate = jobRepository.findByJobDeadlineBeforeAndJobActive(currentDate.minusDays(1), 1);
    //     jobsToUpdate.forEach(job -> job.setJobActive(0));
    //     jobRepository.saveAll(jobsToUpdate);
    // }


    public PageResponseDTO<JobDTO> jobList(PageRequestDTO pageRequestDTO, String searchKeyword, String jobField, String sort) {
        Sort sorting;
        if ("deadline".equals(sort)) {
            sorting = Sort.by("jobDeadline").ascending(); // 마감 임박순
        } else {
            sorting = Sort.by("jobNo").descending(); // 기본 정렬
        }
        
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                sorting);

        Page<Job> result;
        if (searchKeyword != null && !searchKeyword.isEmpty() && jobField != null && !jobField.isEmpty()) { // 직무선택, 검색어 입력한경우
            result = jobRepository.findByJobFieldContainingAndJobTitleContainingAndJobActive(jobField, searchKeyword, 1, pageable);
        } else if (searchKeyword != null && !searchKeyword.isEmpty()) { // 검색어만 입력한경우
            result = jobRepository.findByJobTitleContainingAndJobActive(searchKeyword, 1, pageable);
        } else if (jobField != null && !jobField.isEmpty()) { // 직무만 선택한경우
            result = jobRepository.findByJobFieldContainingAndJobTitleContainingAndJobActive(jobField, "", 1, pageable);
        } else { // 기본
            result = jobRepository.findByJobActive(1, pageable);
        }

        List<JobDTO> dtoList = result.getContent().stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<JobDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    public ExamDTO examRead(Integer examNo) {
        Optional<Exam> result = examRepository.findById(examNo);
        Exam exam = result.orElseThrow();
        ExamDTO dto = modelMapper.map(exam, ExamDTO.class);
        return dto;
    }

    public JobDTO jobRead(Integer jobNo) {
        Optional<Job> result = jobRepository.findById(jobNo);
        Job job = result.orElseThrow();
        JobDTO dto = modelMapper.map(job, JobDTO.class);
        return dto;
    }

    //시험 전체 불러오기
    public List<ExamDTO> examAll() {
        List<Exam> exams = examRepository.findAll();
        return exams.stream()
                    .map(exam -> modelMapper.map(exam, ExamDTO.class))
                    .collect(Collectors.toList());
    }

    //시험 검색 -> 전체 불러오기
    public List<ExamDTO> examSearchAll(String searchKeyword) {
        List<Exam> exams = examRepository.findByExamTitleContaining(searchKeyword);
        return exams.stream()
        .map(exam -> modelMapper.map(exam, ExamDTO.class))
        .collect(Collectors.toList());
    }


    // 채용 검색
    // public PageResponseDTO<JobDTO> jobSearch(PageRequestDTO pageRequestDTO, String searchKeyword) {
    //     Pageable pageable = PageRequest.of(
    //             pageRequestDTO.getPage() - 1, // 1페이지가 0
    //             pageRequestDTO.getSize(),
    //             Sort.by("jobDeadline").descending());
    //     System.out.println("====================");
    //     System.out.println(pageable);

    //     Page<Job> result = jobRepository.findByJobTitleContaining(searchKeyword, pageable);
    //     List<JobDTO> dtoList = result.getContent().stream()
    //             .map(job -> modelMapper.map(job, JobDTO.class))
    //             .collect(Collectors.toList());

    //     long totalCount = result.getTotalElements();
    //     PageResponseDTO<JobDTO> responseDTO = PageResponseDTO.<JobDTO>withAll()
    //             .dtoList(dtoList)
    //             .pageRequestDTO(pageRequestDTO)
    //             .totalCount(totalCount)
    //             .build();
    //     return responseDTO;

    // }

    // 시험 검색
    public PageResponseDTO<ExamDTO> examSearch(PageRequestDTO pageRequestDTO, String searchKeyword) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                Sort.by("examPracRegEnd").descending());

        Page<Exam> result = examRepository.findByExamTitleContaining(searchKeyword, pageable);
        List<ExamDTO> dtoList = result.getContent().stream()
                .map(exam -> modelMapper.map(exam, ExamDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<ExamDTO> responseDTO = PageResponseDTO.<ExamDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }


   


}
