package com.swit.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.BoardDTO;
import com.swit.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/board")
public class BoardController {
    private final BoardService boardService;

    @GetMapping("/{boardNo}")
    public BoardDTO getStudy(@PathVariable(name = "boardNo") Integer boardNo) {
        return boardService.get(boardNo);
    }

    @PostMapping("/")
    public Map<String, Integer> postMethodName(BoardDTO boardDTO) {
        Integer boardNo = boardService.register(boardDTO);
        return Map.of("boardNo", boardNo);
    }
}
