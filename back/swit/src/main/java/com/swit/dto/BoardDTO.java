package com.swit.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BoardDTO {
    private Integer boardNo;
    private String title;
    private String content;
    private String category;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private Integer userNo;
    private List<CommentDTO> comments;
}