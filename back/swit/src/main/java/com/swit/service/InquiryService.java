package com.swit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.swit.domain.Board;
import com.swit.domain.FavoritesPlace;
import com.swit.domain.Inquiry;
import com.swit.domain.Study;
import com.swit.domain.User;
import com.swit.dto.BoardDTO;
import com.swit.dto.InquiryDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.PlaceDTO;
import com.swit.repository.InquiryRepository;
import com.swit.repository.StudyRepository;
import com.swit.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class InquiryService {

  private final InquiryRepository inquiryRepository;
  private final StudyRepository studyRepository;
  private final UserRepository userRepository;
  private final ModelMapper modelMapper;

  @Autowired
  public InquiryService(InquiryRepository inquiryRepository, StudyRepository studyRepository,
      UserRepository userRepository, ModelMapper modelMapper) {
    this.inquiryRepository = inquiryRepository;
    this.studyRepository = studyRepository;
    this.userRepository = userRepository;
    this.modelMapper = modelMapper;
  }

  public void createInquiry(String userId, String inquiryContent, Integer studyNo) {
    User user = userRepository.findByUserId(userId)
        .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + userId));
    Study study = studyRepository.findById(studyNo)
        .orElseThrow(() -> new IllegalArgumentException("Invalid study ID: " + studyNo));
    Inquiry inquiry = new Inquiry();
    inquiry.setUser(user);
    inquiry.setStudy(study);
    inquiry.setInquiryContent(inquiryContent);
    inquiry.setInquiryType("0"); // 질문 유형으로 설정
    inquiryRepository.save(inquiry);
  }

  public Inquiry createResponse(Integer inquiryNo, String responseContent) {
    Inquiry inquiry = inquiryRepository.findById(inquiryNo)
        .orElseThrow(() -> new RuntimeException("Inquiry not found"));
    inquiry.setInquiryType("1");
    inquiry.setResponseContent(responseContent);
    return inquiryRepository.save(inquiry);
  }

  public List<Inquiry> getInquiries(Integer studyNo) {
    return inquiryRepository.findByStudyStudyNo(studyNo);
  }

  public void deleteInquiry(Integer inquiryNo) {
    inquiryRepository.deleteById(inquiryNo);
  }

  // 사용자가 작성한 모든 문의글 조회
    public PageResponseDTO<InquiryDTO> getUserInquiries(PageRequestDTO pageRequestDTO, String userId) {
        Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage() - 1, // 1페이지가 0
            pageRequestDTO.getSize(),
            Sort.by("inquiryNo").descending());

        Page<Inquiry> result = inquiryRepository.findByUserUserId(userId, pageable);
        List<InquiryDTO> dtoList = result.getContent().stream()
            .map(inq -> modelMapper.map(inq, InquiryDTO.class))
            .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<InquiryDTO> responseDTO = PageResponseDTO.<InquiryDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

}