package com.demo.codingtest.model;

import jakarta.persistence.*;

@Entity
@Table(name = "problems")
public class ProblemModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String inputFormat;  

    @Column(columnDefinition = "TEXT")
    private String outputFormat; 

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String sampleTestCases; 

    @Column(columnDefinition = "TEXT")
    private String hiddenTestCases; 

   
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getInputFormat() { return inputFormat; }
    public void setInputFormat(String inputFormat) { this.inputFormat = inputFormat; }

    public String getOutputFormat() { return outputFormat; }
    public void setOutputFormat(String outputFormat) { this.outputFormat = outputFormat; }

    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }

    public String getSampleTestCases() { return sampleTestCases; }
    public void setSampleTestCases(String sampleTestCases) { this.sampleTestCases = sampleTestCases; }

    public String getHiddenTestCases() { return hiddenTestCases; }
    public void setHiddenTestCases(String hiddenTestCases) { this.hiddenTestCases = hiddenTestCases; }
}

