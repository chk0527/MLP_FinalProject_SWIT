package com.swit.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimerDTO {
    private Integer timerNo;
    private String userNick;
    private Integer studyNo;
    private boolean running;
    private String name;
    private Integer time;
    private Integer elapsedTime;

    private LocalDateTime startAt;
    private LocalDateTime stopAt;

    // @CreationTimestamp, @UpdateTimestamp
    // 두 어노테이션 필드는 서버에서 자동 생성,수정해줌
    // 따라서 dto에 넣어서 돌리면 API에서 인식 X
}
