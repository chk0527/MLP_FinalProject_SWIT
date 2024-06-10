package com.swit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.swit.domain.User;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.UserDTO;
import com.swit.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class AdminService {
    // 자동 주입 대상은 final로 설정
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    // 유저 리스트 페이징 처리 메서드
    public PageResponseDTO<UserDTO> getUserList(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize());

        Page<User> result = userRepository.findAll(pageable);
        List<UserDTO> userList = result.getContent().stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<UserDTO> responseDTO = PageResponseDTO.<UserDTO>withAll()
                .dtoList(userList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    //스터디 리스트 페이징 처리 메서드

    //게시글(Q&A) 리스트 페이징 처리 메서드
    
}
