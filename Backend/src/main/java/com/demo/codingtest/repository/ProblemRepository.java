package com.demo.codingtest.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.codingtest.model.ProblemModel;

@Repository
public interface ProblemRepository extends JpaRepository<ProblemModel, Long> {

}
