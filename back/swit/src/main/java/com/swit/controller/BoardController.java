package com.swit.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swit.domain.Board;
import com.swit.dto.BoardDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.BoardPageResponseDTO;
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

    // @GetMapping("/all")
    // public BoardPageResponseDTO<Board> getAllStudies(
    //         @RequestParam(name = "boardTitle", required = false) String boardTitle, // 수정된 부분
    //         @RequestParam(name = "boardCategory", required = false) String boardCategory, // 수정된 부분
    //         @RequestParam(name = "boardContent", required = false) String boardContent, // 수정된 부분
    //         @RequestParam(name = "userNick", required = false) String userNick, // 수정된 부분
    //         BoardPageResponseDTO pageRequestDTO) {
    //     log.info(pageRequestDTO);
    //     return boardService.boardList(boardTitle, boardContent, userNick, pageRequestDTO);
    // }

    @PostMapping("/")
    public Map<String, Integer> postMethodName(BoardDTO boardDTO) {
        Integer boardNo = boardService.register(boardDTO);
        return Map.of("boardNo", boardNo);
    }

    @GetMapping("/list")
    public PageResponseDTO<BoardDTO> List(PageRequestDTO pageRequestDTO) {
        log.info(pageRequestDTO);
        return boardService.list(pageRequestDTO);
    }

    @PutMapping("/{boardNo}")
    public Map<String, String> modify(@PathVariable(name = "boardNo") Integer tno, @RequestBody BoardDTO boardDTO) {
        boardDTO.setBoardNo(tno);
        log.info("Modify:" + boardDTO);
        boardService.modify(boardDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/{boardNo}")
    public Map<String, String> remove(@PathVariable(name = "boardNo") Integer boardNo) {
        log.info("Remove:" + boardNo);
        boardService.remove(boardNo);
        return Map.of("RESULT", "SUCCESS");
    }

    // 유저가 작성한 게시글 리스트 조회
    @GetMapping("/list/{userNo}")
    public PageResponseDTO<BoardDTO> getUserBoards(@PathVariable(name = "userNo") Integer userNo, PageRequestDTO pageRequestDTO) {
        return boardService.getUserBoards(pageRequestDTO, userNo);
    }
}
