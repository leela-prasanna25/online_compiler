package com.demo.codingtest.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.demo.codingtest.model.ProblemModel;
import com.demo.codingtest.dto.ProblemDto;
import com.demo.codingtest.service.ProblemService;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

   
    @PostMapping
    public ResponseEntity<?> createProblem(@RequestBody ProblemDto problemDto) {
        try {
            System.out.println("Received problem creation request: " + problemDto);
            
            // Validate required fields
            if (problemDto.getTitle() == null || problemDto.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            if (problemDto.getDescription() == null || problemDto.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Description is required");
            }
            
            ProblemModel createdProblem = problemService.createProblem(problemDto);
            System.out.println("Problem created successfully with ID: " + createdProblem.getId());
            return ResponseEntity.ok(createdProblem);
        } catch (Exception e) {
            System.err.println("Error creating problem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

   
    @GetMapping
    public ResponseEntity<List<ProblemModel>> getAllProblems() {
        List<ProblemModel> problems = problemService.getAllProblems();
        return ResponseEntity.ok(problems);
    }

 
    @GetMapping("/{id}")
    public ResponseEntity<ProblemModel> getProblemById(@PathVariable Long id) {
        ProblemModel problem = problemService.getProblemById(id);
        return ResponseEntity.ok(problem);
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProblem(@PathVariable Long id) {
        try {
            boolean deleted = problemService.deleteProblem(id);
            if (deleted) {
                return ResponseEntity.ok().body("Problem deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting problem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}

