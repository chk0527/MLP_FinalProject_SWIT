package com.swit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.swit.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {
    @Query("SELECT b FROM Board b WHERE " +
            "(:boardTitle IS NULL OR b.boardTitle LIKE %:boardTitle%) AND " +
            "(:boardContent IS NULL OR b.boardContent LIKE %:boardContent%) AND " +
            "(:userNick IS NULL OR b.userNick LIKE %:userNick%) AND " +
            "(:boardCategory IS NULL OR b.boardCategory = :boardCategory)")
    Page<Board> searchBoards(@Param("boardTitle") String boardTitle, 
                             @Param("boardContent") String boardContent,
                             @Param("userNick") String userNick,
                             @Param("boardCategory") String boardCategory, 
                             Pageable pageable);

    Page<Board> findByUserUserNo(Integer userNo, Pageable pageable);
}
