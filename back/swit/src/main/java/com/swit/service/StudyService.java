package com.swit.service;

import java.util.Optional;

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

    public StudyDTO get(Integer studyNo) {
        Optional<Study> result = studyRepository.findById(studyNo);
        Study study = result.orElseThrow();
        StudyDTO studyDTO = modelMapper.map(study, StudyDTO.class);
        return studyDTO;
    }

    public Integer modify(StudyDTO studyDTO) {
        Optional<Study> result = studyRepository.findById(studyDTO.getStudyNo());
        Study study = result.orElseThrow();
        study.setStudyTitle(studyDTO.getStudyTitle());
        Study saveStudy = studyRepository.save(study);
        return saveStudy.getStudyNo();
    }

    public void remove(Integer studyNo) {
        studyRepository.deleteById(studyNo);
    }
}
