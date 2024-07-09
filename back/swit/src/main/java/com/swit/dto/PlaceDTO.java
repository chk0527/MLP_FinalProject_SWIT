package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaceDTO {
    
    private Long placeNo; // 키값
    @Builder.Default
    private String placeName=""; // 상호명
    @Builder.Default
    private String placeAddr=""; // 주소
    private String placeTime; // 운영시간
    private String placeTel; // 전화번호
    private String placeDetail; // 상세정보
    private String placeImg; // 이미지

}
