package com.demo.codingtest.dto;

public class SubmissionDto {

    private long problemId;
    private String studentName;
    private String code;
    private String language;
    private Integer marks;
    private String status;
    private String output;
    private String testCaseResults;

    public long getProblemId() { return problemId; }
    public void setProblemId(long problemId) { this.problemId = problemId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLanguage() { return language; } 
    public void setLanguage(String language) { this.language = language; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }

    public String getTestCaseResults() { return testCaseResults; }
    public void setTestCaseResults(String testCaseResults) { this.testCaseResults = testCaseResults; }
}
