package com.swit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByBoardBoardNo(Integer boardNo);

  @Modifying
  @Transactional
  @Query("UPDATE Comment c SET c.userNick = :newUserNick WHERE c.userNick = :oldUserNick")
  void updateUserNick(@Param("oldUserNick") String oldUserNick, @Param("newUserNick") String newUserNick);
}