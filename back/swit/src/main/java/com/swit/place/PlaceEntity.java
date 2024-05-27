package com.swit.place;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="place")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int place_no; //키값
    private String place_name; //상호명
    private String place_addr; //주소
    private String place_tel; // 전화번호
    private String place_detail; //상세정보
    private String place_Img; //이미지
}
