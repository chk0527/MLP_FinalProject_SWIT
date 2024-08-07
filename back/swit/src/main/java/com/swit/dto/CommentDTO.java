package com.swit.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import kotlinx.datetime.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Integer commentNo;
    private String commentContent;
    private Integer boardNo;
    private Integer userNo;
    private String userNick;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime commentCreatedDate;
}
