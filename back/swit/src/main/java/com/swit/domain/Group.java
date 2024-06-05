package com.swit.domain;


import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
  
  @ColumnDefault("0")
  @Column(nullable = false)
  private Integer groupLeader;

  @ColumnDefault("0")
  @Column(nullable = false)
  private Integer groupJoin;

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

