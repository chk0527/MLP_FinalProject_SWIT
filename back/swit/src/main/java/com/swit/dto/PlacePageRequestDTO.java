package com.swit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PlacePageRequestDTO {

    @Builder.Default
    private int PlacePage=1;
    @Builder.Default
    private int PlaceSize = 16;
}
