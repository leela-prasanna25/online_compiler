package com.demo.codingtest.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name="submissions")
public class SubmissionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="problem_id")
    private ProblemModel problem; 

    private String studentName;

    @Column(columnDefinition = "TEXT")
    private String code;

    private String language;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String output;

    private Integer marks;

    private Double plagiarismScore;

    @Column(columnDefinition = "TEXT")
    private String testCaseResults; // JSON string storing individual test case results

    private LocalDateTime submittedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProblemModel getProblem() { return problem; }
    public void setProblem(ProblemModel problem) { this.problem = problem; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    public Double getPlagiarismScore() { return plagiarismScore; }
    public void setPlagiarismScore(Double plagiarismScore) { this.plagiarismScore = plagiarismScore; }

    public String getTestCaseResults() { return testCaseResults; }
    public void setTestCaseResults(String testCaseResults) { this.testCaseResults = testCaseResults; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
