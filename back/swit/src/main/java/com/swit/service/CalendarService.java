package com.swit.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Calendar;
import com.swit.dto.CalendarDTO;
import com.swit.repository.CalendarRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class CalendarService {
    private final ModelMapper modelMapper;
    private final CalendarRepository calendarRepository;

    // 해당 스터디의 모든 일정(캘린더) 가져오기
    public List<CalendarDTO> getAllEvents(Integer studyNo) {
        List<Calendar> events = calendarRepository.findByStudyNo(studyNo);
        if (events.isEmpty()) {
            log.warn("No events found for studyNo: " + studyNo);
            return Collections.emptyList();
        }
        return events.stream()
                .map(event -> modelMapper.map(event, CalendarDTO.class))
                .collect(Collectors.toList());
    }

    // 해당 스터디에서 일정(캘린더) 새로 추가
    public CalendarDTO addEvent(CalendarDTO calendarDTO) {
        Calendar calendar = modelMapper.map(calendarDTO, Calendar.class);
        calendar = calendarRepository.save(calendar);
        CalendarDTO dto = modelMapper.map(calendar, CalendarDTO.class);
        return dto;
    }

    // 해당 스터디에서 일정(캘린더) 하나 삭제
    public void deleteEvent(Integer eventId) {
        Optional<Calendar> calendar = calendarRepository.findById(eventId);
        if (calendar.isPresent()) {
            calendarRepository.deleteById(eventId);
        } else {
            throw new NoSuchElementException("Event with id " + eventId + " not found");
        }
    }

    // 해당 스터디에서 일정(캘린더)의 모든 속성 업데이트
    public CalendarDTO updateEvent(Integer eventId, Map<String, Object> updates) {
        Calendar calendar = calendarRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 일정입니다."));

        // 수정된 필드만 업데이트하도록 모든 요소에 if문 설정
        if (updates.containsKey("title")) {
            calendar.setTitle((String) updates.get("title"));
        }
        if (updates.containsKey("content")) {
            calendar.setContent((String) updates.get("content"));
        }
        if (updates.containsKey("startDate")) {
            calendar.setStartDate(LocalDateTime.parse((String) updates.get("startDate")));
        }
        if (updates.containsKey("endDate")) {
            calendar.setEndDate(LocalDateTime.parse((String) updates.get("endDate")));
        }
        if (updates.containsKey("completeChk")) {
            calendar.setCompleteChk((Boolean) updates.get("completeChk"));
        }

        calendar = calendarRepository.save(calendar);
        return modelMapper.map(calendar, CalendarDTO.class);
    }
}
