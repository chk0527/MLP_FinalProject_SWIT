package com.swit.domain;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "group1") // 테이블 이름을 변경
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Group {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer groupNo;
  
  private String userId;
  
  private Integer studyNo;
  
  @ManyToOne
  @JoinColumn(name = "studyNo", insertable = false, updatable = false)
  private Study study;

  @ColumnDefault("0")
  @Column(nullable = false)
  private Integer groupLeader; //0: 스터디원 1: 스터디장

  @ColumnDefault("0")
  @Column(nullable = false)
  private Integer groupJoin; //0: 보류 1: 승인 2: 거절

  @PrePersist
  protected void onCreate() {
      if (this.groupLeader == null) {
          this.groupLeader = 0;
      }
      if (this.groupJoin == null) {
          this.groupJoin = 0;
      }
  }
}
