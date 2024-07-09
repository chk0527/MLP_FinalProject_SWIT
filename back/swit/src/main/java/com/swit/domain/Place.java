package com.swit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="place")
@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long placeNo; //키값
    private String placeName; //상호명
    private String placeAddr; //주소
    private String placeTime; //운영시간
    private String placeTel; // 전화번호
    @Column(length = 1000)
    private String placeDetail; //상세정보
    @Column(length = 1000)
    private String placeImg; //이미지
}
