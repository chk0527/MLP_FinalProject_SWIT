package com.swit.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import javax.xml.parsers.DocumentBuilderFactory;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.swit.domain.Exam;
import com.swit.domain.Job;
import com.swit.dto.ExamDTO;
import com.swit.dto.JobDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.repository.ExamRepository;
import com.swit.repository.JobRepository;

import jakarta.transaction.Transactional;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;
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

    public PageResponseDTO<JobDTO> jobList(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                Sort.by("jobDeadline").descending());
        System.out.println("====================");
        System.out.println(pageable);

        Page<Job> result = jobRepository.findAll(pageable);
        List<JobDTO> dtoList = result.getContent().stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<JobDTO> responseDTO = PageResponseDTO.<JobDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
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
    public List<Exam> examAll(){
        return examRepository.findAll();
    }

    // 검색
    public PageResponseDTO<JobDTO> jobSearch(PageRequestDTO pageRequestDTO, String searchKeyword) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                Sort.by("jobDeadline").descending());
        System.out.println("====================");
        System.out.println(pageable);

        Page<Job> result = jobRepository.findByJobTitleContaining(searchKeyword, pageable);
        List<JobDTO> dtoList = result.getContent().stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<JobDTO> responseDTO = PageResponseDTO.<JobDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;

    }

}
