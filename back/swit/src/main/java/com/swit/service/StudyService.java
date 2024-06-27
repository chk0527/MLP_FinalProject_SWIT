package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Group;
import com.swit.domain.Question;
import com.swit.domain.Study;
import com.swit.domain.StudyImage;
import com.swit.dto.CustomUserDetails;
import com.swit.dto.QuestionDTO;
import com.swit.dto.StudyDTO;
import com.swit.dto.StudyPageRequestDTO;
import com.swit.dto.StudyPageResponseDTO;
import com.swit.dto.StudyWithQuestionDTO;
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

    // 전체 스터디
    public StudyPageResponseDTO<Study> studyList(String studyTitle,
            String studySubject,
            String studyAddr,
            Boolean studyOnline, String userId, StudyPageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getStudyPage() - 1, // 1페이지가 0
                pageRequestDTO.getStudySize());

        Page<Study> result = studyRepository.studyList(studyTitle,
                studySubject,
                studyAddr,
                studyOnline, userId, pageable);
        List<Study> studyList = result.getContent().stream()
                .map(Study -> modelMapper.map(Study, Study.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        StudyPageResponseDTO<Study> responseDTO = StudyPageResponseDTO.<Study>withAll()
                .dtoList(studyList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;

    }

    // 나의 스터디
    public List<Study> myStudy(String userId) { // 내가 가입되어있는 그룹 리스트
        return studyRepository.myStudy(userId);
    }

    // 스터디별 질문
    public Integer register(StudyDTO studyDTO, List<String> questions) {
        log.info("-----------------------------");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info(authentication + "@@");
        log.info(authentication.getClass().getName() + "!!");
        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String userId = userDetails.getUsername();
            studyDTO.setUserId(userId);
        } else {
            throw new IllegalStateException("Authentication principal is not an instance of CustomUserDetails");
        }
        String studyUuid = generateStudyUuid();
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

    public StudyWithQuestionDTO getStudyWithQuestionDTO(Integer studyNo) {
        Study study = studyRepository.findById(studyNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid study ID"));
        Question question = questionRepository.findById(studyNo)
                .orElseThrow(() -> new IllegalArgumentException("Invalid question ID"));
        StudyDTO studyDTO = entityToDTO(study);
        QuestionDTO questionDTO = modelMapper.map(question, QuestionDTO.class);
        // StudyDTO studyDTO = modelMapper.map(study, StudyDTO.class);
        return new StudyWithQuestionDTO(studyDTO, questionDTO);
    }

    public void modify(StudyDTO studyDTO, List<String> questions) {
        Optional<Study> result = studyRepository.findById(studyDTO.getStudyNo());
        Study study = result.orElseThrow(() -> new IllegalArgumentException("Invalid study ID"));

        study.setStudyTitle(studyDTO.getStudyTitle());
        study.setStudyContent(studyDTO.getStudyContent());
        study.setStudyType(studyDTO.getStudyType());
        study.setStudyStartDate(studyDTO.getStudyStartDate());
        study.setStudyHeadcount(studyDTO.getStudyHeadcount());
        study.setStudyOnline(studyDTO.getStudyOnline());
        study.setStudySubject(studyDTO.getStudySubject());
        study.setStudyAddr(studyDTO.getStudyAddr());
        study.setStudyUuid(studyDTO.getStudyUuid());

        // Update image list
        study.getImageList().clear();
        studyDTO.getUploadFileNames().forEach(study::addImageString);

        Study saveStudy = studyRepository.save(study);

        Optional<Question> questionResult = questionRepository.findById(studyDTO.getStudyNo());
        Question question = questionResult.orElseThrow(() -> new IllegalArgumentException("Invalid study ID"));
        question.setStudy(saveStudy);
        question.setQ1(questions.size() > 0 ? questions.get(0) : null);
        question.setQ2(questions.size() > 1 ? questions.get(1) : null);
        question.setQ3(questions.size() > 2 ? questions.get(2) : null);
        question.setQ4(questions.size() > 3 ? questions.get(3) : null);
        question.setQ5(questions.size() > 4 ? questions.get(4) : null);
        questionRepository.save(question);
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
                .userId(study.getUserId())
                .studyTitle(study.getStudyTitle())
                .studyContent(study.getStudyContent())
                .studyType(study.getStudyType())
                .studyStartDate(study.getStudyStartDate())
                .studyHeadcount(study.getStudyHeadcount())
                .studyOnline(study.getStudyOnline())
                .studySubject(study.getStudySubject())
                .studyAddr(study.getStudyAddr())
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
                .userId(studyDTO.getUserId())
                .studyTitle(studyDTO.getStudyTitle())
                .studyContent(studyDTO.getStudyContent())
                .studyType(studyDTO.getStudyType())
                .studyStartDate(studyDTO.getStudyStartDate())
                .studyHeadcount(studyDTO.getStudyHeadcount())
                .studyOnline(studyDTO.getStudyOnline())
                .studySubject(studyDTO.getStudySubject())
                .studyAddr(studyDTO.getStudyAddr())
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