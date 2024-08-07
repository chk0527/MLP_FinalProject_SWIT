package com.swit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Inquiry;
import com.swit.dto.InquiryDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.ResponseDTO;
import com.swit.service.InquiryService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/study")
public class InquiryController {

    private final InquiryService inquiryService;

    @Autowired
    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping("/{studyNo}/inquiries")
    public ResponseEntity<?> createInquiry(@PathVariable(name="studyNo") Integer studyNo, @RequestBody InquiryDTO inquiryDTO, @AuthenticationPrincipal UserDetails principal) {
        String userId = principal.getUsername();
        String inquiryContent = inquiryDTO.getInquiryContent();
        inquiryService.createInquiry(userId, inquiryContent, studyNo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/inquiries/{inquiryNo}/responses")
    public ResponseEntity<?> createResponse(@PathVariable(name="inquiryNo") Integer inquiryNo, @RequestBody ResponseDTO responseDTO) {
        String responseContent = responseDTO.getResponseContent();
        inquiryService.createResponse(inquiryNo, responseContent);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{studyNo}/inquiries")
    public List<Inquiry> getInquiries(@PathVariable(name="studyNo") Integer studyNo) {
        return inquiryService.getInquiries(studyNo);
    }

    @DeleteMapping("/inquiries/{inquiryNo}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable("inquiryNo") Integer inquiryNo) {
        inquiryService.deleteInquiry(inquiryNo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/list/{userId}/inquiries")
    public PageResponseDTO<InquiryDTO> getUserInquiries(PageRequestDTO pageRequestDTO, @PathVariable(name="userId") String userId) {
        return inquiryService.getUserInquiries(pageRequestDTO, userId);
    }
}
