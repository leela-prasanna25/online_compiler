package com.demo.codingtest.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.demo.codingtest.model.SubmissionModel;
import com.demo.codingtest.model.ProblemModel;

@Repository
public interface SubmissionRepository extends JpaRepository<SubmissionModel, Long> {
    List<SubmissionModel> findByProblem(ProblemModel problem);
    List<SubmissionModel> findByStudentName(String studentName);
}
