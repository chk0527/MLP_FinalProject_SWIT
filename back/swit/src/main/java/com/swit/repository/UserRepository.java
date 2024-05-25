package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.User;

public interface UserRepository extends JpaRepository<User, String> {

}