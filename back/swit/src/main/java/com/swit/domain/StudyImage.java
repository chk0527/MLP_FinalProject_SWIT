package com.swit.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Embeddable //값 타입 객체임을 명시함 --> PK가 없는 데이터 
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyImage {
    private String fileName;
    private int ord; //이미지들 중 대표 이미지만 화면에 출력
    public void setOrd(int ord){
        this.ord = ord;
    }
}
