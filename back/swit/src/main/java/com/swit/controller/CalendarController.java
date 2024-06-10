package com.swit.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.swit.dto.CalendarDTO;
import com.swit.service.CalendarService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/calendar")
public class CalendarController {
    @Autowired
    private CalendarService calendarService;

    // 해당 스터디의 모든 일정 데이터 조회
    @GetMapping("/{studyNo}")
    public ResponseEntity<List<CalendarDTO>> getCalendar(@PathVariable Integer studyNo) {
        List<CalendarDTO> events = calendarService.getAllEvents(studyNo);
        return ResponseEntity.ok(events);
    }

    // 해당 스터디에서 일정 새로 생성
    @PostMapping("/{studyNo}")
    public ResponseEntity<CalendarDTO> addEvent(
            @PathVariable Integer studyNo,
            @RequestBody CalendarDTO calendarDTO) {
        calendarDTO.setStudyNo(studyNo);
        CalendarDTO newEvent = calendarService.addEvent(calendarDTO);
        return new ResponseEntity<>(newEvent, HttpStatus.CREATED);
    }

    // 해당 스터디에서 일정 하나 삭제
    @DeleteMapping("/{studyNo}/{eventId}")
    public void deleteEvent(
            @PathVariable Integer studyNo,
            @PathVariable Integer eventId) {
        calendarService.deleteEvent(eventId);
    }

    // 해당 스터디에서 일정 하나 수정
    @PatchMapping("/{studyNo}/{eventId}")
    public ResponseEntity<CalendarDTO> updateEvent(
            @PathVariable Integer studyNo,
            @PathVariable Integer eventId,
            @RequestBody Map<String, Object> updates) {
        CalendarDTO updatedEvent = calendarService.updateEvent(eventId, updates);
        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    }
}