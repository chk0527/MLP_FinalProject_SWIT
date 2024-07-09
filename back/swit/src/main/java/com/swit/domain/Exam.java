package com.swit.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
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
@Table(name = "exam")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer examNo;
    
    @Column(length = 1000)
    private String examTitle;
    @Column(length = 150)
    private String examDesc; // 자격구분
    
    //필기시험
    private LocalDate examDocStart;
    private LocalDate examDocEnd;

    //필기 접수
    private LocalDate examDocRegStart;
    private LocalDate examDocRegEnd;

    //실기시험
    private LocalDate examPracStart;
    private LocalDate examPracEnd;

    //실기접수
    private LocalDate examPracRegStart;
    private LocalDate examPracRegEnd;

    //합격일
    private LocalDate examDocPass;
    private LocalDate examPracPass;

    

}
