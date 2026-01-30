import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { problemAPI, submissionAPI } from '../services/api'

function Compiler() {
  const [searchParams] = useSearchParams()
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('java')
  const [studentName, setStudentName] = useState('')
  const [runLoading, setRunLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isRunMode, setIsRunMode] = useState(true) // Track if it's run or submit

  const problemId = searchParams.get('problem')

  useEffect(() => {
    if (problemId) {
      loadProblem()
    }
  }, [problemId])

  const loadProblem = async () => {
    try {
      console.log('Loading problem with ID:', problemId)
      const response = await problemAPI.getProblemById(problemId)
      console.log('Backend response:', response)
      setProblem(response)
      setCode(getDefaultCode(problemId, language))
    } catch (err) {
      console.error('Failed to load problem from backend:', err)
      setError('Failed to load problem from backend')
      setProblem(null)
    }
  }

  const handleRun = async () => {
    // Validation
    if (!studentName.trim()) {
      setError('Student name is required')
      return
    }

    if (!code.trim()) {
      setError('Please write some code before running')
      return
    }

    if (!problemId) {
      setError('No problem selected')
      return
    }

    try {
      setRunLoading(true)
      setError(null)
      setResult(null)
      setIsRunMode(true) // Set to run mode

      const submissionData = {
        problemId: parseInt(problemId),
        studentName: studentName.trim(),
        code: code,
        language: language
      }

      console.log('Running code:', submissionData)
      const response = await submissionAPI.runCode(submissionData)
      console.log('Run response:', response)
      setResult(response)
    } catch (err) {
      console.error('Run error:', err)
      setError('Failed to run code. Please ensure the backend is running.')
    } finally {
      setRunLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!studentName.trim()) {
      setError('Student name is required')
      return
    }

    if (!code.trim()) {
      setError('Please write some code before submitting')
      return
    }

    if (!problemId) {
      setError('No problem selected')
      return
    }

    try {
      setSubmitLoading(true)
      setError(null)
      setResult(null)
      setIsRunMode(false) // Set to submit mode

      const submissionData = {
        problemId: parseInt(problemId),
        studentName: studentName.trim(),
        code: code,
        language: language
      }

      console.log('Submitting code:', submissionData)
      const response = await submissionAPI.submitCode(submissionData)
      console.log('Submission response:', response)
      setResult(response)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Failed to submit code. Please ensure the backend is running.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const getDefaultCode = (problemId, language) => {
    const templates = {
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
      python: `# Your code here
n = int(input())
# Add your solution`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,
      javascript: `// Your code here
`,
      csharp: `using System;

class Program {
    static void Main() {
        // Your code here
        Console.ReadLine();
    }
}`,
      ruby: `# Your code here
input = gets.chomp
# Add your solution`,
      go: `package main

import (
    "fmt"
    "bufio"
    "os"
)

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    // Your code here
}`,
      php: `<?php
// Your code here
$input = trim(fgets(STDIN));
// Add your solution
?>`
    }
    return templates[language] || templates.java
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    setCode(getDefaultCode(problemId, newLanguage))
  }

  // Always show the compiler interface

  return (
    <div>
      {problem ? (
        <div className="card">
          <h2>{problem.title}</h2>
          <p><strong>Description:</strong> {problem.description}</p>
        
        {problem.inputFormat && (
          <div>
            <strong>Input Format:</strong>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '5px',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {problem.inputFormat}
            </pre>
          </div>
        )}
        
        {problem.outputFormat && (
          <div>
            <strong>Output Format:</strong>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '5px',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {problem.outputFormat}
            </pre>
          </div>
        )}
        
        {problem.constraints && (
          <div>
            <strong>Constraints:</strong>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '5px',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              {problem.constraints}
            </pre>
          </div>
        )}
        </div>
      ) : null}

      <div className="card">
        <h3>Code Editor</h3>
        
        <div style={{ marginBottom: '15px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="studentName" style={{ marginRight: '10px' }}>
              Student Name:
            </label>
            <input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name (required)"
              required
              style={{ 
                padding: '5px 10px', 
                borderRadius: '4px', 
                border: studentName.trim() ? '1px solid #ddd' : '1px solid #dc3545',
                minWidth: '200px',
                backgroundColor: studentName.trim() ? 'white' : '#fff5f5'
              }}
            />
          </div>
          <div>
            <label htmlFor="language" style={{ marginRight: '10px' }}>Language:</label>
            <select 
              id="language"
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="javascript">JavaScript</option>
              <option value="csharp">C#</option>
              <option value="ruby">Ruby</option>
              <option value="go">Go</option>
              <option value="php">PHP</option>
            </select>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={problemId ? "Write your code here..." : "Please select a problem from the Problems page to start coding"}
          style={{
            width: '100%',
            height: '400px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px',
            resize: 'vertical',
            backgroundColor: problemId ? 'white' : '#f8f9fa'
          }}
          disabled={!problemId}
        />

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button 
            className="btn" 
            onClick={handleRun}
            disabled={runLoading || submitLoading || !problemId}
            style={{ 
              backgroundColor: problemId ? '#10b981' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: problemId ? 'pointer' : 'not-allowed'
            }}
          >
            {runLoading ? 'Running...' : 'Run Code'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={runLoading || submitLoading || !problemId}
            style={{
              backgroundColor: problemId ? '#007bff' : '#6c757d',
              cursor: problemId ? 'pointer' : 'not-allowed'
            }}
          >
            {submitLoading ? 'Submitting...' : 'Submit Code'}
          </button>
        </div>

        {error && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: '4px',
            color: '#721c24'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '20px' }}>
            {isRunMode ? (
              // Show detailed results for Run Code
              <>
                <h4>Code Execution Result</h4>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#d4edda', 
                  border: '1px solid #c3e6cb', 
                  borderRadius: '4px'
                }}>
                  <p><strong>Status:</strong> {result.status}</p>
                  <p><strong>Marks:</strong> {result.marks}/10</p>
                  {result.output && (
                    <div>
                      <strong>Output:</strong>
                      <pre style={{ 
                        background: '#f8f9fa', 
                        padding: '10px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginTop: '5px',
                        fontSize: '12px',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {result.output}
                      </pre>
                    </div>
                  )}
                  
                  {result.testCaseResults && (
                    <div style={{ marginTop: '15px' }}>
                      <strong>Test Case Results:</strong>
                      {(() => {
                        try {
                          const testResults = JSON.parse(result.testCaseResults);
                          return (
                            <div style={{ marginTop: '10px' }}>
                              {testResults.map((testResult, index) => (
                                <div key={index} style={{ 
                                  border: '1px solid #ddd', 
                                  borderRadius: '4px', 
                                  padding: '10px', 
                                  marginBottom: '10px',
                                  backgroundColor: testResult.passed ? '#d4edda' : '#f8d7da'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong>Test Case {testResult.testCaseNumber}</strong>
                                    <span style={{ 
                                      padding: '2px 8px', 
                                      borderRadius: '4px', 
                                      fontSize: '12px',
                                      backgroundColor: testResult.passed ? '#28a745' : '#dc3545',
                                      color: 'white'
                                    }}>
                                      {testResult.passed ? 'PASSED' : 'FAILED'}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '12px' }}>
                                    <p><strong>Input:</strong> <code>{testResult.input}</code></p>
                                    <p><strong>Expected:</strong> <code>{testResult.expectedOutput}</code></p>
                                    <p><strong>Actual:</strong> <code>{testResult.actualOutput}</code></p>
                                    {testResult.error && (
                                      <p style={{ color: 'red' }}><strong>Error:</strong> {testResult.error}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } catch (e) {
                          return (
                            <div style={{ 
                              background: '#f8f9fa', 
                              padding: '10px', 
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              marginTop: '5px',
                              fontSize: '12px'
                            }}>
                              {result.testCaseResults}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Show simple success message for Submit Code
              <>
                <h4>Submission Result</h4>
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#d4edda', 
                  border: '1px solid #c3e6cb', 
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅</div>
                  <h3 style={{ color: '#155724', margin: '0 0 10px 0' }}>Submission Successful!</h3>
                  <p style={{ color: '#155724', margin: '0', fontSize: '16px' }}>
                    Your code has been submitted successfully. You can check your submission status and results in the Submissions page.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {!problem && (
        <div className="card" style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>No Problem Selected</h3>
          <p>Please select a problem from the <a href="/problems" style={{ color: '#007bff', textDecoration: 'none' }}>Problems</a> page to start coding.</p>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>You can still write code in the editor above, but you won't be able to run or submit it until you select a problem.</p>
        </div>
      )}
    </div>
  )
}

export default Compiler