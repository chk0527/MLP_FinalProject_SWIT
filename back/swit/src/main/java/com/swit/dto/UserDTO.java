package com.swit.dto;

import java.time.LocalDateTime;
// import java.util.Date;

// import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
// import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Integer userNo;
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

    // @JsonCreator
    // public UserDTO(
    //     @JsonProperty("userNo") Integer userNo,
    //     @JsonProperty("userId") String userId,
    //     @JsonProperty("userEmail") String userEmail,
    //     @JsonProperty("userName") String confirmPath,
    //     @JsonProperty("userPassword") String userPassword,
    //     @JsonProperty("userPhone") String userPhone,
    //     @JsonProperty("userNick") String userNick,
    //     @JsonProperty("userSnsConnect") String userSnsConnect,
    //     @JsonProperty("userImage") String userImage,
    //     @JsonProperty("userCreateDate") LocalDateTime userCreateDate,
    //     @JsonProperty("userDeleteChk") boolean userDeleteChk,
    //     @JsonProperty("userDeleteDate") LocalDateTime userDeleteDate,
    //     @JsonProperty("userRole") String userRole ) {
    //         this.userNo = userNo;
    //         this.userId = userId;
    //         this.userEmail = userEmail;
    //         this.userName = userName;
    //         this.userPassword = userPassword;
    //         this.userPhone = userPhone;
    //         this.userNick = userNick;
    //         this.userSnsConnect = userSnsConnect;
    //         this.userImage = userImage;
    //         this.userCreateDate = userCreateDate;
    //         this.userDeleteChk = userDeleteChk;
    //         this.userDeleteDate = userDeleteDate;
    //         this.userRole = userRole;
    // }
    
}
