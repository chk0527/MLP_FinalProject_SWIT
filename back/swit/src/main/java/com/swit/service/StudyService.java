package com.swit.service;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Question;
import com.swit.domain.Study;
import com.swit.domain.StudyImage;
import com.swit.dto.StudyDTO;
import com.swit.repository.QuestionRepository;
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
    private final QuestionRepository questionRepository;
    private final HttpSession session;

    public List<Study> getAllStudies() {
      return studyRepository.findAll();
  }
  

    public Integer register(StudyDTO studyDTO, List<String> questions) {
        log.info("-----------------------------");
        String userId = "user1"; //추후 현재 로그인된 사용자 받아오도록 수정
        String studyUuid = generateStudyUuid();

        studyDTO.setUserId(userId);
        studyDTO.setStudyUuid(studyUuid);

        // Study study = modelMapper.map(studyDTO, Study.class);
        
        Study study = dtoToEntity(studyDTO);

        Study saveStudy = studyRepository.save(study);
        Question question = new Question();
        question.setStudy(saveStudy);
        question.setQ1(questions.size() > 0 ? questions.get(0) : null);
        question.setQ2(questions.size() > 1 ? questions.get(1) : null);
        question.setQ3(questions.size() > 2 ? questions.get(2) : null);
        question.setQ4(questions.size() > 3 ? questions.get(3) : null);
        question.setQ5(questions.size() > 4 ? questions.get(4) : null);

        questionRepository.save(question);

        return saveStudy.getStudyNo();
    }

    public StudyDTO get(Integer studyNo) {
        Optional<Study> result = studyRepository.findById(studyNo);
        Study study = result.orElseThrow();
        StudyDTO studyDTO = entityToDTO(study);
        // StudyDTO studyDTO = modelMapper.map(study, StudyDTO.class);
        return studyDTO;
    }

    public void modify(StudyDTO studyDTO) {
        Optional<Study> result = studyRepository.findById(studyDTO.getStudyNo());
        Study study = result.orElseThrow(() -> new IllegalArgumentException("Invalid study ID"));

        study.setStudyTitle(studyDTO.getStudyTitle());
        study.setStudyContent(studyDTO.getStudyContent());
        study.setStudyType(studyDTO.getStudyType());
        study.setStudyStartDate(studyDTO.getStudyStartDate());
        study.setStudyEndDate(studyDTO.getStudyEndDate());
        study.setStudyHeadcount(studyDTO.getStudyHeadcount());
        study.setStudyOnline(studyDTO.getStudyOnline());
        study.setStudySubject(studyDTO.getStudySubject());
        study.setStudyComm(studyDTO.getStudyComm());
        study.setStudyLink(studyDTO.getStudyLink());
        study.setStudyUuid(studyDTO.getStudyUuid());

        // Update image list
        study.getImageList().clear();
        studyDTO.getUploadFileNames().forEach(study::addImageString);

        studyRepository.save(study);
    }

    public void remove(Integer studyNo) {
        studyRepository.deleteById(studyNo);
    }

     private String generateStudyUuid() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 20);
    }

    private StudyDTO entityToDTO(Study study) {
    StudyDTO studyDTO = StudyDTO.builder()
        .studyNo(study.getStudyNo())
        .userId(study.getUser_id())
        .studyTitle(study.getStudyTitle())
        .studyContent(study.getStudyContent())
        .studyType(study.getStudyType())
        .studyStartDate(study.getStudyStartDate())
        .studyEndDate(study.getStudyEndDate())
        .studyHeadcount(study.getStudyHeadcount())
        .studyOnline(study.getStudyOnline())
        .studySubject(study.getStudySubject())
        .studyComm(study.getStudyComm())
        .studyLink(study.getStudyLink())
        .studyUuid(study.getStudyUuid())
        .build();

    List<StudyImage> imageList = study.getImageList();
    if (imageList == null || imageList.isEmpty()) {
        return studyDTO;
    }

    List<String> fileNameList = imageList.stream()
        .map(StudyImage::getFileName)
        .collect(Collectors.toList());
    studyDTO.setUploadFileNames(fileNameList);

    return studyDTO;
}

    private Study dtoToEntity(StudyDTO studyDTO) {
        Study study = Study.builder()
            .studyNo(studyDTO.getStudyNo())
            .user_id(studyDTO.getUserId())
            .studyTitle(studyDTO.getStudyTitle())
            .studyContent(studyDTO.getStudyContent())
            .studyType(studyDTO.getStudyType())
            .studyStartDate(studyDTO.getStudyStartDate())
            .studyEndDate(studyDTO.getStudyEndDate())
            .studyHeadcount(studyDTO.getStudyHeadcount())
            .studyOnline(studyDTO.getStudyOnline())
            .studySubject(studyDTO.getStudySubject())
            .studyComm(studyDTO.getStudyComm())
            .studyLink(studyDTO.getStudyLink())
            .studyUuid(studyDTO.getStudyUuid())
            .build();
    
        // 업로드 처리가 끝난 파일들의 이름
        List<String> uploadFileNames = studyDTO.getUploadFileNames();
        if (uploadFileNames == null) {
            return study;
        }
        uploadFileNames.forEach(uploadName -> {
            study.addImageString(uploadName);
        });
    
        return study;
    }
}
