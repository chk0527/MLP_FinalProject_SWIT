package com.swit.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.swit.domain.Board;
import com.swit.dto.BoardDTO;
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
    
}
