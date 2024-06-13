package com.swit.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupDTO {
  private Integer groupNo;
  private String userId;
  private Integer studyNo;
  private Integer groupLeader;
  private Integer groupJoin;
}
