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
import com.swit.domain.Comment;
import com.swit.domain.Todo;
import com.swit.dto.BoardDTO;
import com.swit.dto.CommentDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.repository.BoardRepository;
import com.swit.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final ModelMapper modelMapper;
    private final CommentRepository commentRepository;

    public Integer register(CommentDTO commentDTO) {
        Comment comment = modelMapper.map(commentDTO, Comment.class);
        return commentRepository.save(comment).getCommentNo();
    }

    public List<CommentDTO> getCommentsByBoardNo(Integer boardNo) {
        List<Comment> comments = commentRepository.findByBoardBoardNo(boardNo);
        return comments.stream()
                .map(comment -> modelMapper.map(comment, CommentDTO.class))
                .collect(Collectors.toList());
    }
    // public BoardDTO get(Integer boardNo) {
    //     Board board = boardRepository.findById(boardNo).orElseThrow();
    //     BoardDTO boardDTO = modelMapper.map(board, BoardDTO.class);
    //     return boardDTO;
    // }

    // public PageResponseDTO<BoardDTO> list(PageRequestDTO pageRequestDTO) {
    //     Pageable pageable = PageRequest.of(
    //             pageRequestDTO.getPage() - 1, // 1페이지가 0
    //             pageRequestDTO.getSize(),
    //             Sort.by("boardNo").descending());

    //     Page<Board> result = boardRepository.findAll(pageable);
    //     List<BoardDTO> dtoList = result.getContent().stream()
    //             .map(todo -> modelMapper.map(todo, BoardDTO.class))
    //             .collect(Collectors.toList());

    //     long totalCount = result.getTotalElements();
    //     PageResponseDTO<BoardDTO> responseDTO = PageResponseDTO.<BoardDTO>withAll()
    //             .dtoList(dtoList)
    //             .pageRequestDTO(pageRequestDTO)
    //             .totalCount(totalCount)
    //             .build();
    //     return responseDTO;
    // }

    // public void modify(BoardDTO boardDTO){
    //     Optional<Board> result = boardRepository.findById(boardDTO.getBoardNo());
    //     Board board = result.orElseThrow();
    //     board.setBoardTitle(boardDTO.getBoardTitle());
    //     board.setBoardCategory(boardDTO.getBoardCategory());
    //     board.setBoardContent(boardDTO.getBoardContent());
    //     boardRepository.save(board);
    // }

    // public void remove(Integer boardNo){
    //     boardRepository.deleteById(boardNo);
    // }
}
