package com.swit.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
// import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
// @AllArgsConstructor
@NoArgsConstructor
public class ConfirmDTO {
    private Integer confirmNo;
    @Column(unique = true, nullable = false)            // 홈페이지 가입회원 대상
    private String userId;
    private String confirmTarget;                       // "1" 아이디 "2" 패스워드
    private String confirmPath;                         // "1" 이메일 "2" 핸드폰
    private String confirmNum;                          // 난수 발생 6자리 숫자
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime confirmLimitDate;             

    @JsonCreator
    public ConfirmDTO(
        @JsonProperty("confirmNo") Integer confirmNo,
        @JsonProperty("userId") String userId,
        @JsonProperty("confirmTarget") String confirmTarget,
        @JsonProperty("confirmPath") String confirmPath,
        @JsonProperty("confirmNum") String confirmNum,
        @JsonProperty("confirmLimitDate") LocalDateTime confirmLimitDate
    ) {
        this.confirmNo = confirmNo;
        this.userId = userId;
        this.confirmTarget = confirmTarget;
        this.confirmPath = confirmPath;
        this.confirmNum = confirmNum;
        this.confirmLimitDate = confirmLimitDate;
    }
}
