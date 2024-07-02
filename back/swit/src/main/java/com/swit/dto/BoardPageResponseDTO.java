package com.swit.dto;


import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import lombok.Builder;
import lombok.Data;

@Data
public class BoardPageResponseDTO<E> {
    private List<E> dtoList;
    private List<Integer> pageNumList;
    private StudyPageRequestDTO pageRequestDTO;
    private boolean prev, next;
    private int totalCount, prevPage, nextPage, totalPage, current;

    @Builder(builderMethodName = "withAll")
    public BoardPageResponseDTO(List<E> dtoList, StudyPageRequestDTO pageRequestDTO, long totalCount){
        this.dtoList = dtoList;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = (int) totalCount;

        int end = (int)(Math.ceil(pageRequestDTO.getStudyPage()/10.0))*10;
        int start = end-9;
        int last = (int)(Math.ceil((totalCount/(double)pageRequestDTO.getStudySize())));

        end  = end > last?last:end;
        this.prev = start >1;
        this.next = totalCount > end * pageRequestDTO.getStudySize();
        this.pageNumList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());
        if(prev){
            this.prevPage = start -1;
        }
        if(next){
            this.nextPage = end+1;
        }

        this.totalPage = this.pageNumList.size();
        this.current = pageRequestDTO.getStudyPage();
    }
}
