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
public class PlaceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long place_no; //키값
    private String place_name; //상호명
    private String place_addr; //주소
    private String place_time; //운영시간
    private String place_tel; // 전화번호
    @Column(length = 1000)
    private String place_detail; //상세정보
    @Column(length = 1000)
    private String place_Img; //이미지
}
