package com.swit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {
    // 사용자가 작성한 모든 게시글 조회
    Page<Board> findByUserUserNo(Integer userNo, Pageable pageable);
    
    @Modifying
    @Transactional
    @Query("UPDATE Board b SET b.userNick = :newUserNick WHERE b.userNick = :oldUserNick")
    void updateUserNick(@Param("oldUserNick") String oldUserNick, @Param("newUserNick") String newUserNick);
}
