package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupRequestDTO {
    private Integer groupNo;
    private String userId;
    private String userNick;
    private Integer studyNo;
    private Integer groupLeader;
    private Integer groupJoin;
}
