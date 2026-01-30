package com.demo.codingtest.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Pattern;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.demo.codingtest.dto.SubmissionDto;
import com.demo.codingtest.model.ProblemModel;
import com.demo.codingtest.model.SubmissionModel;
import com.demo.codingtest.repository.ProblemRepository;
import com.demo.codingtest.repository.SubmissionRepository;

@Service
public class SubmissionService {

    private SubmissionRepository submissionRepository;
    private ProblemRepository problemRepository;
    private WebClient webClient;

    public SubmissionService(SubmissionRepository submissionRepository,
                             ProblemRepository problemRepository,
                             WebClient webClient) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.webClient = webClient;
    }

    public SubmissionDto submitCode(SubmissionDto submissionDto) {
        
        ProblemModel problem = findProblemById(submissionDto.getProblemId());
        if (problem == null) {
            return null; 
        }

      
        SubmissionModel submission = saveSubmissionToDatabase(submissionDto, problem);

        try {
            
            List<TestCase> allTestCases = getAllTestCases(problem);
            if (allTestCases.isEmpty()) {
                return handleNoTestCases(submission, submissionDto);
            }

           
            TestExecutionResults results = runAllTestCases(submissionDto, allTestCases);

           
            int marks = calculateMarks(results.passedTests, results.totalTests);
            String status = determineStatus(results);

           
            saveTestResults(submission, status, marks, results);

        } catch (Exception e) {
            handleExecutionError(submission, e);
        }

      
        return convertToResponseDto(submission, submissionDto);
    }


    private ProblemModel findProblemById(Long problemId) {
        Optional<ProblemModel> optionalProblem = problemRepository.findById(problemId);
        return optionalProblem.orElse(null);
    }
    

    private SubmissionModel saveSubmissionToDatabase(SubmissionDto submissionDto, ProblemModel problem) {
        SubmissionModel submission = new SubmissionModel();
        submission.setProblem(problem);
        submission.setStudentName(submissionDto.getStudentName());
        submission.setCode(submissionDto.getCode());
        submission.setLanguage(submissionDto.getLanguage());
        submission.setStatus("PENDING");
        submission.setSubmittedAt(LocalDateTime.now());
        return submissionRepository.save(submission);
    }
    
//collect all test cases
    private List<TestCase> getAllTestCases(ProblemModel problem) {
        List<TestCase> allTestCases = new ArrayList<>();
        allTestCases.addAll(parseTestCases(problem.getSampleTestCases()));
        allTestCases.addAll(parseTestCases(problem.getHiddenTestCases()));
        return allTestCases;
    }
    

    private SubmissionDto handleNoTestCases(SubmissionModel submission, SubmissionDto submissionDto) {
        submission.setStatus("ERROR");
        submission.setOutput("No test cases found for this problem");
        submission.setMarks(0);
        submission.setTestCaseResults("[]");
        submissionRepository.save(submission);
        return convertToResponseDto(submission, submissionDto);
    }
    

    private TestExecutionResults runAllTestCases(SubmissionDto submissionDto, List<TestCase> allTestCases) {
        List<TestCaseResult> allResults = new ArrayList<>();
        List<TestCaseResult> sampleResults = new ArrayList<>();
        int passedTests = 0;
        int sampleTestsPassed = 0;
        
      
        List<TestCase> sampleTestCases = parseTestCases(
            problemRepository.findById(submissionDto.getProblemId()).get().getSampleTestCases()
        );
        int sampleTestsTotal = sampleTestCases.size();
        
       
        for (int i = 0; i < allTestCases.size(); i++) {
            TestCase testCase = allTestCases.get(i);
            TestCaseResult result = runTestCase(submissionDto.getCode(), submissionDto.getLanguage(), testCase, i + 1);
            allResults.add(result);
            
            if (result.isPassed()) {
                passedTests++;
            }
            
            
            if (i < sampleTestsTotal) {
                sampleResults.add(result);
                if (result.isPassed()) {
                    sampleTestsPassed++;
                }
            }
        }
        
        return new TestExecutionResults(allResults, sampleResults, passedTests, allTestCases.size(), sampleTestsPassed, sampleTestsTotal);
    }
    

    private int calculateMarks(int passedTests, int totalTests) {

        return (int) Math.round((double) passedTests / totalTests * 10);
    }
    

    private String determineStatus(TestExecutionResults results) {
        if (results.passedTests == results.totalTests) {
            return "Accepted";
        } else if (results.sampleTestsPassed == results.sampleTestsTotal && results.passedTests < results.totalTests) {
            return "Wrong Answer";
        } else if (results.passedTests > 0) {
            return "Partial (" + results.passedTests + "/" + results.totalTests + " test cases passed)";
        } else {
            return "Wrong Output";
        }
    }
    

    private void saveTestResults(SubmissionModel submission, String status, int marks, TestExecutionResults results) {
       
        String testCaseResultsJson = convertResultsToJson(results.sampleResults);     
        submission.setStatus(status);
        submission.setMarks(marks);
        submission.setTestCaseResults(testCaseResultsJson);
        submission.setOutput("Test Results: " + results.passedTests + "/" + results.totalTests + " passed");
        submission.setPlagiarismScore(0.0);
        submissionRepository.save(submission);
    }
    

    private String convertResultsToJson(List<TestCaseResult> sampleResults) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode resultsArray = mapper.createArrayNode();
            for (TestCaseResult result : sampleResults) {
                ObjectNode resultNode = mapper.createObjectNode();
                resultNode.put("testCaseNumber", result.getTestCaseNumber());
                resultNode.put("input", result.getInput());
                resultNode.put("expectedOutput", result.getExpectedOutput());
                resultNode.put("actualOutput", result.getActualOutput());
                resultNode.put("passed", result.isPassed());
                resultNode.put("error", result.getError());
                resultsArray.add(resultNode);
            }
            return resultsArray.toString();
        } catch (Exception e) {
            return "[]";
        }
    }
    

    private void handleExecutionError(SubmissionModel submission, Exception e) {
        submission.setStatus("ERROR");
        submission.setOutput("Error while executing code: " + e.getMessage());
        submission.setMarks(0);
        submission.setTestCaseResults("[]");
        submissionRepository.save(submission);
    }
    
//return response to frontend
    private SubmissionDto convertToResponseDto(SubmissionModel submission, SubmissionDto originalDto) {
        SubmissionDto responseDto = new SubmissionDto();
        responseDto.setProblemId(submission.getProblem() != null ? submission.getProblem().getId() : originalDto.getProblemId());
        responseDto.setStudentName(submission.getStudentName());
        responseDto.setCode(submission.getCode());
        responseDto.setLanguage(submission.getLanguage());
        responseDto.setMarks(submission.getMarks());
        responseDto.setStatus(submission.getStatus());
        responseDto.setOutput(submission.getOutput());
        responseDto.setTestCaseResults(submission.getTestCaseResults());
        return responseDto;
    }
    

    private static class TestExecutionResults {
        List<TestCaseResult> allResults;
        List<TestCaseResult> sampleResults;
        int passedTests;
        int totalTests;
        int sampleTestsPassed;
        int sampleTestsTotal;
        
        TestExecutionResults(List<TestCaseResult> allResults, List<TestCaseResult> sampleResults, 
                           int passedTests, int totalTests, int sampleTestsPassed, int sampleTestsTotal) {
            this.allResults = allResults;
            this.sampleResults = sampleResults;
            this.passedTests = passedTests;
            this.totalTests = totalTests;
            this.sampleTestsPassed = sampleTestsPassed;
            this.sampleTestsTotal = sampleTestsTotal;
        }
    }

          
    public SubmissionDto runCode(SubmissionDto submissionDto) {
       
        ProblemModel problem = findProblemById(submissionDto.getProblemId());
        if (problem == null) {
            return null; 
        }

        try {
           
            List<TestCase> allTestCases = getAllTestCases(problem);
            if (allTestCases.isEmpty()) {
                return createErrorResponse(submissionDto, "No test cases found for this problem");
            }

            
            TestExecutionResults results = runAllTestCases(submissionDto, allTestCases);

          
            int marks = calculateMarks(results.passedTests, results.totalTests);
            String status = determineStatus(results);

            
            return createSuccessResponse(submissionDto, status, marks, results);

        } catch (Exception e) {
            return createErrorResponse(submissionDto, "Error while executing code: " + e.getMessage());
        }
    }
    
    
 
    private SubmissionDto createErrorResponse(SubmissionDto submissionDto, String errorMessage) {
        SubmissionDto responseDto = new SubmissionDto();
        responseDto.setProblemId(submissionDto.getProblemId());
        responseDto.setStudentName(submissionDto.getStudentName());
        responseDto.setCode(submissionDto.getCode());
        responseDto.setLanguage(submissionDto.getLanguage());
        responseDto.setMarks(0);
        responseDto.setStatus("ERROR");
        responseDto.setOutput(errorMessage);
        responseDto.setTestCaseResults("[]");
        return responseDto;
    }
    
   
    private SubmissionDto createSuccessResponse(SubmissionDto submissionDto, String status, int marks, TestExecutionResults results) {
        SubmissionDto responseDto = new SubmissionDto();
        responseDto.setProblemId(submissionDto.getProblemId());
        responseDto.setStudentName(submissionDto.getStudentName());
        responseDto.setCode(submissionDto.getCode());
        responseDto.setLanguage(submissionDto.getLanguage());
        responseDto.setMarks(marks);
        responseDto.setStatus(status);
        responseDto.setOutput("Test Results: " + results.passedTests + "/" + results.totalTests + " passed");
        responseDto.setTestCaseResults(convertResultsToJson(results.sampleResults));
        return responseDto;
    }

   
    public List<SubmissionModel> getSubmissionsByProblem(Long problemId) {
        Optional<ProblemModel> optionalProblem = problemRepository.findById(problemId);

        if (optionalProblem.isPresent()) {
            ProblemModel problem = optionalProblem.get();
            return submissionRepository.findByProblem(problem);
        } else {
            return null;
        }
    }


    public List<SubmissionModel> getSubmissionsByStudent(String studentName) {
        return submissionRepository.findByStudentName(studentName);
    }

   
    public List<SubmissionModel> getAllSubmissions() {
        return submissionRepository.findAll();
    }

   
    public boolean deleteSubmission(long id) {
        if (submissionRepository.existsById(id)) {
            submissionRepository.deleteById(id);
            return true;
        }
        return false;
    }


    private int getLanguageId(String language) {
        return switch (language.toLowerCase()) {
            case "python", "python3" -> 71;
            case "java" -> 62;
            case "c" -> 50;
            case "c++", "cpp", "cplusplus" -> 54;
            case "javascript", "js" -> 63;
            case "c#", "csharp" -> 51;
            case "ruby" -> 72;
            case "go", "golang" -> 60;
            case "php" -> 68;
            default -> 71; 
        };
    }


    private List<TestCase> parseTestCases(String testCasesString) {
        List<TestCase> testCases = new ArrayList<>();
        
        if (testCasesString == null || testCasesString.isEmpty()) {
            return testCases;
        }


        String[] testCaseBlocks = testCasesString.split("Test Case");
        
        for (String block : testCaseBlocks) {
            if (block.trim().isEmpty()) continue;
            
            TestCase testCase = parseSingleTestCase(block);
            if (testCase != null) {
                testCases.add(testCase);
            }
        }

        return testCases;
    }
    

    private TestCase parseSingleTestCase(String block) {
        String[] lines = block.split("\n");
        StringBuilder inputBuilder = new StringBuilder();
        StringBuilder outputBuilder = new StringBuilder();
        boolean foundInput = false;
        boolean foundOutput = false;
        
        for (String line : lines) {
            line = line.trim();
            

            if (line.toLowerCase().contains("input")) {
                String inputLine = extractValueAfterColon(line);
                if (!inputLine.isEmpty()) {
                    if (inputBuilder.length() > 0) inputBuilder.append("\n");
                    inputBuilder.append(inputLine);
                }
                foundInput = true;
                foundOutput = false;
            } 
            
            else if (line.toLowerCase().contains("output")) {
                String outputLine = extractValueAfterColon(line);
                if (!outputLine.isEmpty()) {
                    if (outputBuilder.length() > 0) outputBuilder.append("\n");
                    outputBuilder.append(outputLine);
                }
                foundOutput = true;
                foundInput = false;
            } 
           
            else if (foundInput && !line.isEmpty() && !isTestCaseNumber(line)) {
                if (inputBuilder.length() > 0) inputBuilder.append("\n");
                inputBuilder.append(line);
            } 
           
            else if (foundOutput && !line.isEmpty() && !isTestCaseNumber(line)) {
                if (outputBuilder.length() > 0) outputBuilder.append("\n");
                outputBuilder.append(line);
            }
        }
        
        String input = inputBuilder.toString().trim();
        String output = outputBuilder.toString().trim();
        
      
        if (!input.isEmpty() && !output.isEmpty()) {
            return new TestCase(input, output);
        }
        
        return null;
    }
    

    private String extractValueAfterColon(String line) {
        int colonIndex = line.indexOf(':');
        if (colonIndex != -1) {
            return line.substring(colonIndex + 1).trim();
        }
        return "";
    }

    private boolean isTestCaseNumber(String line) {
        return line.matches("\\d+:?");
    }

//single testcase excution
    private TestCaseResult runTestCase(String code, String language, TestCase testCase, int testCaseNumber) {
        try {
           
            Map<String, Object> payload = createJudge0Payload(code, language, testCase.getInput());
            
          
            Map<String, Object> result = executeCodeOnJudge0(payload);
            
           
            String actualOutput = extractOutput(result);
            String error = extractError(result);
            
            
            boolean passed = actualOutput.trim().equals(testCase.getExpectedOutput().trim());
            
            return new TestCaseResult(testCaseNumber, testCase.getInput(), 
                    testCase.getExpectedOutput(), actualOutput, passed, error);

        } catch (Exception e) {
            return new TestCaseResult(testCaseNumber, testCase.getInput(), 
                    testCase.getExpectedOutput(), "", false, "Execution error: " + e.getMessage());
        }
    }
    

    private Map<String, Object> createJudge0Payload(String code, String language, String input) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("source_code", code);
        payload.put("language_id", getLanguageId(language));
        payload.put("stdin", input);
        payload.put("cpu_time_limit", "5.0");
        payload.put("memory_limit", 128000);
        payload.put("wall_time_limit", "10.0");
        return payload;
    }
    

    private Map<String, Object> executeCodeOnJudge0(Map<String, Object> payload) {
       
        String[] endpoints = {
            "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
            "http://localhost:2358/submissions?base64_encoded=false&wait=true"
        };
        
       
        for (String url : endpoints) {
            try {
                Map<String, Object> result = webClient.post()
                        .uri(url)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(payload)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .timeout(java.time.Duration.ofSeconds(10))
                        .block();
                
                if (result != null && !result.isEmpty()) {
                    return result; 
                }
            } catch (Exception e) {
               
                continue;
            }
        }
        
       
        return createMockResponse("", "");
    }


   
    private String extractOutput(Map<String, Object> result) {
        String output = "";
        
        if (result.get("stdout") != null) {
            output = result.get("stdout").toString().trim();
        }
        
      
        if (output.isEmpty() && result.get("output") != null) {
            output = result.get("output").toString().trim();
        }
        
        return output;
    }

   
    private String extractError(Map<String, Object> result) {
        StringBuilder error = new StringBuilder();
        
       
        if (result.get("compile_output") != null && !result.get("compile_output").toString().trim().isEmpty()) {
            error.append("Compilation Error: ").append(result.get("compile_output").toString().trim());
        }
        
      
        if (result.get("stderr") != null && !result.get("stderr").toString().trim().isEmpty()) {
            if (error.length() > 0) error.append("\n");
            error.append("Runtime Error: ").append(result.get("stderr").toString().trim());
        }
        
      
        if (result.get("message") != null && !result.get("message").toString().trim().isEmpty()) {
            if (error.length() > 0) error.append("\n");
            error.append("System Message: ").append(result.get("message").toString().trim());
        }
        
        return error.toString();
    }

    
    private String extractStatus(Map<String, Object> result) {
        if (result.get("status") != null) {
            return result.get("status").toString();
        }
        return null;
    }


    // Create simple mock response when Judge0 is unavailable
    private Map<String, Object> createMockResponse(String code, String input) {
        Map<String, Object> mockResponse = new HashMap<>();
        
        // Simple mock response
        mockResponse.put("stdout", "Mock Output - Judge0 unavailable");
        mockResponse.put("status", "3");
        mockResponse.put("stderr", "");
        mockResponse.put("compile_output", "");
        mockResponse.put("message", "Mock response - Judge0 service unavailable");
        
        return mockResponse;
    }

    // Helper classes for test case handling
    private static class TestCase {
        private String input;
        private String expectedOutput;

        public TestCase(String input, String expectedOutput) {
            this.input = input;
            this.expectedOutput = expectedOutput;
        }

        public String getInput() { return input; }
        public String getExpectedOutput() { return expectedOutput; }
    }

    private static class TestCaseResult {
        private int testCaseNumber;
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private boolean passed;
        private String error;

        public TestCaseResult(int testCaseNumber, String input, String expectedOutput, 
                             String actualOutput, boolean passed, String error) {
            this.testCaseNumber = testCaseNumber;
            this.input = input;
            this.expectedOutput = expectedOutput;
            this.actualOutput = actualOutput;
            this.passed = passed;
            this.error = error;
        }

        public int getTestCaseNumber() { return testCaseNumber; }
        public String getInput() { return input; }
        public String getExpectedOutput() { return expectedOutput; }
        public String getActualOutput() { return actualOutput; }
        public boolean isPassed() { return passed; }
        public String getError() { return error; }
    }
}
