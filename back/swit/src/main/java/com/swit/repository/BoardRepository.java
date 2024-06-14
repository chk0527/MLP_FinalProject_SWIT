package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {

}
