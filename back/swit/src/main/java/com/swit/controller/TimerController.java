package com.swit.controller;

import java.util.List;
import java.util.Map;

import com.swit.dto.TimerDTO;
import com.swit.service.TimerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/timer")
public class TimerController {

    @Autowired
    private TimerService timerService;

    // 해당 스터디의 모든 타이머 조회
    @GetMapping("/{studyNo}")
    public ResponseEntity<List<TimerDTO>> getTimers(@PathVariable Integer studyNo) {
        List<TimerDTO> timers = timerService.getAllTimers(studyNo);
        return ResponseEntity.ok(timers);
    }

    // 해당 스터디에서 타이머 새로 생성
    @PostMapping("/{studyNo}")
    public ResponseEntity<TimerDTO> addTimer(
            @PathVariable Integer studyNo,
            @RequestBody TimerDTO timerDTO) {
        timerDTO.setStudyNo(studyNo);
        TimerDTO newTimer = timerService.addTimer(timerDTO);
        return new ResponseEntity<>(newTimer, HttpStatus.CREATED);
    }

    // 해당 스터디에서 타이머 하나 삭제
    @DeleteMapping("/{studyNo}/{timerNo}")
    public void deleteTimer(
            @PathVariable Integer studyNo,
            @PathVariable Integer timerNo) {
                timerService.deleteTimer(timerNo);
    }

    // 해당 스터디에서 타이머 하나 수정
    @PatchMapping("/{studyNo}/{timerNo}")
    public ResponseEntity<TimerDTO> updateTimer(
            @PathVariable Integer studyNo,
            @PathVariable Integer timerNo,
            @RequestBody Map<String, Object> updates) {
        TimerDTO updatedTimer = timerService.updateTimer(timerNo, updates);
        return new ResponseEntity<>(updatedTimer, HttpStatus.OK);
    }
}
