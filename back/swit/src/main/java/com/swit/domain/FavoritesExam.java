package com.swit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "favorites_exam")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoritesExam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorites_exam_no")
    private Long favoritesExamNo;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName="userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "exam_no",referencedColumnName="examNo", nullable = false)
    private Exam exam;

}
