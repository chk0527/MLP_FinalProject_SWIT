package com.swit.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmReqDTO {
    private String certifyType;         // "1" 이메일 "2" 핸드폰 검증
    private String id;                  // 회원아이디 
    private String name;                // 회원명 
    private String email;               
    private String phone;               
}