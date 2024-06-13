package com.swit.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CommentDTO {
    private Integer commentNo;
    private String commentContent;
    private Integer boardNo;
    private Integer userNo;
}
