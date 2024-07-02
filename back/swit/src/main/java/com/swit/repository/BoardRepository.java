package com.swit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {
    // 사용자가 작성한 모든 게시글 조회
    Page<Board> findByUserUserNo(Integer userNo, Pageable pageable);
}
