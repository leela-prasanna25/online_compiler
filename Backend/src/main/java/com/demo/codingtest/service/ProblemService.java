package com.demo.codingtest.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.demo.codingtest.dto.ProblemDto;
import com.demo.codingtest.model.ProblemModel;
import com.demo.codingtest.repository.ProblemRepository;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public ProblemModel createProblem(ProblemDto request){
        ProblemModel problem = new ProblemModel();
        
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        problem.setConstraints(request.getConstraints());
        problem.setSampleTestCases(request.getSampleTestCases());
        problem.setHiddenTestCases(request.getHiddenTestCases());

        return problemRepository.save(problem);
    }

  
    public List<ProblemModel> getAllProblems() {
        return problemRepository.findAll();
    }

   
    public ProblemModel getProblemById(long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id " + id));
    }

  
    public boolean deleteProblem(long id) {
        if (problemRepository.existsById(id)) {
            problemRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
