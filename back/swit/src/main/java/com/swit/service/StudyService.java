package com.swit.service;

import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Study;
import com.swit.dto.StudyDTO;
import com.swit.repository.StudyRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class StudyService {
    private final ModelMapper modelMapper;
    private final StudyRepository studyRepository;
    private final HttpSession session;

    public Integer register(StudyDTO studyDTO) {
        log.info("-----------------------------");
        String userId = "user1"; //추후 현재 로그인된 사용자 받아오도록 수정
        String studyUuid = generateStudyUuid();

        studyDTO.setUserId(userId);
        studyDTO.setStudyUuid(studyUuid);

        Study study = modelMapper.map(studyDTO, Study.class);
        Study saveStudy = studyRepository.save(study);
        return saveStudy.getStudyNo();
    }

    public StudyDTO get(Integer studyNo) {
        Optional<Study> result = studyRepository.findById(studyNo);
        Study study = result.orElseThrow();
        StudyDTO dto = modelMapper.map(study, StudyDTO.class);
        return dto;
    }

     private String generateStudyUuid() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 20);
    }
}
