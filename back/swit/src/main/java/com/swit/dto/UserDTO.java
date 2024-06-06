package com.swit.dto;

import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String  userId;
    private String  userEmail;
    private String  userName;
    private String  userPassword;
    private String  userPhone;
    private String  userNick;
    private String  userSnsConnect;
    private String  userImage;

    // LocalDateTime의 JSON 포맷 설정
    // 기존 "yyyy-MM-dd"로 하면 포맷 비일치로 인한 충돌 에러 발생!!
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime userCreateDate;
    private boolean userDeleteChk;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime    userDeleteDate;
    private String    userRole;
}
