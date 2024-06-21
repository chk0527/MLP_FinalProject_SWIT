package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

}
