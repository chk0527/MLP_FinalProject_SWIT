package com.swit.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swit.domain.Inquiry;
import com.swit.domain.Study;
import com.swit.domain.User;
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

    @Autowired
    public InquiryService(InquiryRepository inquiryRepository, StudyRepository studyRepository, UserRepository userRepository) {
        this.inquiryRepository = inquiryRepository;
        this.studyRepository = studyRepository;
        this.userRepository = userRepository;
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
        Inquiry inquiry = inquiryRepository.findById(inquiryNo).orElseThrow(() -> new RuntimeException("Inquiry not found"));
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
}