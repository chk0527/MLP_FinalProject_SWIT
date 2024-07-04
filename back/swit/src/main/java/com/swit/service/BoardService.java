package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.swit.domain.Board;
import com.swit.domain.Study;
import com.swit.domain.Todo;
import com.swit.dto.BoardDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.dto.BoardPageResponseDTO;
import com.swit.repository.BoardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final ModelMapper modelMapper;
    private final BoardRepository boardRepository;

    public Integer register(BoardDTO boardDTO) {
        Board board = modelMapper.map(boardDTO, Board.class);
        return boardRepository.save(board).getBoardNo();
    }

    public BoardDTO get(Integer boardNo) {
        Board board = boardRepository.findById(boardNo).orElseThrow();
        BoardDTO boardDTO = modelMapper.map(board, BoardDTO.class);
        return boardDTO;
    }

    public PageResponseDTO<BoardDTO> list(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                Sort.by("boardNo").descending());

        Page<Board> result = boardRepository.findAll(pageable);
        List<BoardDTO> dtoList = result.getContent().stream()
                .map(todo -> modelMapper.map(todo, BoardDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<BoardDTO> responseDTO = PageResponseDTO.<BoardDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    public void modify(BoardDTO boardDTO){
        Optional<Board> result = boardRepository.findById(boardDTO.getBoardNo());
        Board board = result.orElseThrow();
        board.setBoardTitle(boardDTO.getBoardTitle());
        board.setBoardCategory(boardDTO.getBoardCategory());
        board.setBoardContent(boardDTO.getBoardContent());
        boardRepository.save(board);
    }

    public void remove(Integer boardNo){
        boardRepository.deleteById(boardNo);
    }

    // 사용자가 작성한 모든 게시글 조회
    public PageResponseDTO<BoardDTO> getUserBoards(PageRequestDTO pageRequestDTO, Integer userNo) {
        Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage() - 1, // 1페이지가 0
            pageRequestDTO.getSize(),
            Sort.by("boardNo").descending());

        Page<Board> result = boardRepository.findByUserUserNo(userNo, pageable);
        List<BoardDTO> dtoList = result.getContent().stream()
                .map(todo -> modelMapper.map(todo, BoardDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<BoardDTO> responseDTO = PageResponseDTO.<BoardDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    // 게시글 검색
    public PageResponseDTO<BoardDTO> searchBoards(PageRequestDTO pageRequestDTO, String boardTitle, String boardContent, String userNick, String boardCategory) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("boardNo").descending());

        Page<Board> result = boardRepository.searchBoards(boardTitle, boardContent, userNick, boardCategory, pageable);
        List<BoardDTO> dtoList = result.getContent().stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<BoardDTO> responseDTO = PageResponseDTO.<BoardDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }
}
