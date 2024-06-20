package com.swit.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.BoardDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



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

    @GetMapping("/list")
    public PageResponseDTO<BoardDTO>List(PageRequestDTO pageRequestDTO){
        log.info(pageRequestDTO);
        return boardService.list(pageRequestDTO);
    }

    @PutMapping("/{boardNo}")
    public Map<String, String> modify(@PathVariable(name="boardNo") Integer tno, @RequestBody BoardDTO boardDTO) {
        boardDTO.setBoardNo(tno);
        log.info("Modify:" + boardDTO);
        boardService.modify(boardDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/{boardNo}")
    public Map<String, String> remove(@PathVariable(name="boardNo") Integer boardNo) {
        log.info("Remove:" + boardNo);
        boardService.remove(boardNo);
        return Map.of("RESULT", "SUCCESS");
    }
}
