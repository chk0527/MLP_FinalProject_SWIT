package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.swit.domain.Exam;
import com.swit.dto.ExamDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.repository.ExamRepository;

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

    public PageResponseDTO<ExamDTO> list(PageRequestDTO pageRequestDTO){
        Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage()-1, //1페이지가 0
            pageRequestDTO.getSize(),
            Sort.by("examNo").descending());
            System.out.println("====================");
            System.out.println(pageable);
         
            Page<Exam> result = examRepository.findAll(pageable);
            List<ExamDTO> dtoList = result.getContent().stream()
            .map(exam-> modelMapper.map(exam, ExamDTO.class))
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
