package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoritesExamDTO {
    // private Long favoritesExamNo;
    private String userId;
    private Integer examNo;
}
