package com.demo.codingtest.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.demo.codingtest.model.SubmissionModel;
import com.demo.codingtest.dto.SubmissionDto;
import com.demo.codingtest.service.SubmissionService;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

  
    @PostMapping
    public ResponseEntity<SubmissionDto> submitCode(@RequestBody SubmissionDto submissionDto) {
        SubmissionDto submission = submissionService.submitCode(submissionDto);
        return ResponseEntity.ok(submission);
    }

 
    @PostMapping("/run")
    public ResponseEntity<SubmissionDto> runCode(@RequestBody SubmissionDto submissionDto) {
        SubmissionDto result = submissionService.runCode(submissionDto);
        return ResponseEntity.ok(result);
    }

   
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<SubmissionModel>> getSubmissionsByProblem(@PathVariable Long problemId) {
        List<SubmissionModel> submissions = submissionService.getSubmissionsByProblem(problemId);
        return ResponseEntity.ok(submissions);
    }

    
    @GetMapping("/student/{studentName}")
    public ResponseEntity<List<SubmissionModel>> getSubmissionsByStudent(@PathVariable String studentName) {
        List<SubmissionModel> submissions = submissionService.getSubmissionsByStudent(studentName);
        return ResponseEntity.ok(submissions);
    }

   
    @GetMapping
    public ResponseEntity<List<SubmissionModel>> getAllSubmissions() {
        List<SubmissionModel> submissions = submissionService.getAllSubmissions();
        return ResponseEntity.ok(submissions);
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long id) {
        try {
            boolean deleted = submissionService.deleteSubmission(id);
            if (deleted) {
                return ResponseEntity.ok().body("Submission deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting submission: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}

