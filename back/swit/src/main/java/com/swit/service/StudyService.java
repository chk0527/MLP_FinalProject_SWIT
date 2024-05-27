package com.swit.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Study;
import com.swit.dto.StudyDTO;
import com.swit.repository.StudyRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class StudyService {
    private final ModelMapper modelMapper;
    private final StudyRepository studyRepository;

    public Integer register(StudyDTO studyDTO) {
        log.info("-----------------------------");
        Study study = modelMapper.map(studyDTO, Study.class);
        Study saveStudy = studyRepository.save(study);
        return saveStudy.getStudyNo();
    }
}
