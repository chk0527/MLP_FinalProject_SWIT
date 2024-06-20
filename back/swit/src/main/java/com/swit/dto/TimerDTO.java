package com.swit.dto;

import java.time.Duration;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.DurationDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.DurationSerializer;

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
    private String userId;
    private Integer studyNo;
    private boolean running;
    private String name;
    private String time;
    private String type;
    private Integer elapsedTime;

    // @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    // private LocalDateTime createdAt;

    // @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss")
    // private LocalDateTime updatedAt;

    // @CreationTimestamp, @UpdateTimestamp 
    // 두 어노테이션 필드는 서버에서 자동 생성,수정해줌
    // 따라서 dto에 넣어서 돌리면 API에서 인식 X
}
