package com.swit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swit.domain.Group;

public interface GroupRepository extends JpaRepository<Group, Integer> {

}
