package com.demo.codingtest.dto;

public class ProblemDto {
    private String title;
    private String description;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private String sampleTestCases;
    private String hiddenTestCases;

  
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

    @Override
    public String toString() {
        return "ProblemDto{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", inputFormat='" + inputFormat + '\'' +
                ", outputFormat='" + outputFormat + '\'' +
                ", constraints='" + constraints + '\'' +
                ", sampleTestCases='" + sampleTestCases + '\'' +
                '}';
    }
}
