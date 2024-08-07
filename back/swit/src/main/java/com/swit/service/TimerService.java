package com.swit.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Study;
import com.swit.domain.User;
import com.swit.domain.Timer;
import com.swit.dto.TimerDTO;
import com.swit.repository.StudyRepository;
import com.swit.repository.TimerRepository;
import com.swit.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class TimerService {
    private final ModelMapper modelMapper;
    private final TimerRepository timerRepository;
    private final StudyRepository studyRepository;
    private final UserRepository userRepository;

    // 해당 스터디의 모든 타이머 정보 가져오기
    public List<TimerDTO> getAllTimers(Integer studyNo) {
        List<Timer> timers = timerRepository.findByStudyNo(studyNo);
        if (timers.isEmpty()) {
            log.warn("No timers found for studyNo: " + studyNo);
            return Collections.emptyList();
        }
        return timers.stream()
                .map(event -> modelMapper.map(event, TimerDTO.class))
                .collect(Collectors.toList());
    }

    // 해당 스터디의 그룹원의 타이머 정보 가져오기
    public List<TimerDTO> getUserTimers(Integer studyNo, String userNick) {
        List<Timer> timers = timerRepository.findByStudyUserNick(studyNo, userNick);
        if (timers.isEmpty()) {
            log.warn("No timers found for studyNo: " + studyNo + " and userNick: " + userNick);
            return Collections.emptyList();
        }
        return timers.stream()
                .map(event -> modelMapper.map(event, TimerDTO.class))
                .collect(Collectors.toList());
    }

    // 해당 스터디에서 타이머 새로 추가
    public TimerDTO addTimer(TimerDTO timerDTO) {
        Timer timer = modelMapper.map(timerDTO, Timer.class);
        Study study = studyRepository.findById(timerDTO.getStudyNo())
                .orElseThrow(() -> new NoSuchElementException("Study not found"));
        User user = userRepository.findByUserNick(timerDTO.getUserNick())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        timer.setStudy(study);
        timer.setUser(user);
        timer = timerRepository.save(timer);
        TimerDTO dto = modelMapper.map(timer, TimerDTO.class);
        return dto;
    }

    // 타이머 정보 업데이트
    public TimerDTO updateTimer(Integer timerNo, Map<String, Object> updates) {
        Timer timer = timerRepository.findById(timerNo)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 타이머입니다."));

        // 수정된 필드만 업데이트하도록 모든 요소에 if문 설정
        if (updates.containsKey("name")) {
            timer.setName((String) updates.get("name"));
        }
        if (updates.containsKey("running")) {
            timer.setRunning((Boolean) updates.get("running"));
        }
        if (updates.containsKey("elapsedTime")) {
            timer.setElapsedTime((Integer) updates.get("elapsedTime"));
        }
        if (updates.containsKey("time")) {
            timer.setTime((Integer) updates.get("time"));
        }
        // startAt, stopAt : 파싱할 때 null 허용
        // 초기값이 null이여야 해서 허용 처리 필요
        if (updates.containsKey("startAt")) {
            String startAtStr = (String) updates.get("startAt");
            if (startAtStr != null && timer.getStartAt() == null) {
                timer.setStartAt(LocalDateTime.parse(startAtStr, DateTimeFormatter.ISO_DATE_TIME));
            }
        }
        if (updates.containsKey("stopAt")) {
            String stopAtStr = (String) updates.get("stopAt");
            if (stopAtStr != null) {
                timer.setStopAt(LocalDateTime.parse(stopAtStr, DateTimeFormatter.ISO_DATE_TIME));
            }
        }
        Timer updatedTimer = timerRepository.save(timer);
        return modelMapper.map(updatedTimer, TimerDTO.class);
    }

    // 타이머 삭제
    public void deleteTimer(Integer timerNo) {
        timerRepository.deleteById(timerNo);
    }
}
