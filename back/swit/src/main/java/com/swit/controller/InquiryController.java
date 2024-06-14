package com.swit.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Inquiry;
import com.swit.service.InquiryService;

@RestController
@RequestMapping("/api/study")
public class InquiryController {

    private final InquiryService inquiryService;

    @Autowired
    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping("/{studyNo}/inquiries")
    public ResponseEntity<?> createInquiry(@PathVariable Integer studyNo, @RequestBody String inquiryContent, @AuthenticationPrincipal UserDetails principal) {
        String userId = principal.getUsername();
        inquiryService.createInquiry(userId, inquiryContent, studyNo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/inquiries/{inquiryNo}/responses")
    public ResponseEntity<?> createResponse(@PathVariable Integer inquiryNo, @RequestBody String responseContent) {
        inquiryService.createResponse(inquiryNo, responseContent);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{studyNo}/inquiries")
    public List<Inquiry> getInquiries(@PathVariable Integer studyNo) {
        return inquiryService.getInquiries(studyNo);
    }
}
