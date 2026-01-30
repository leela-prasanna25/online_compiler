import React, { useState, useEffect } from 'react'

function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSubmissions()
    loadProblems()
  }, [])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading submissions from backend...')
      console.log('API URL:', 'http://localhost:8082/api/submissions')
      
      
      const response = await fetch('http://localhost:8082/api/submissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Backend response:', data)
      console.log('Response type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      console.log('Data length:', data?.length || 0)
      
      if (Array.isArray(data)) {
        setSubmissions(data)
        console.log('Submissions loaded successfully:', data.length, 'submissions')
      } else {
        console.error('Response is not an array:', data)
        setError('Invalid response format from backend')
        setSubmissions([])
      }
    } catch (err) {
      console.error('Failed to load submissions from backend:', err)
      setSubmissions([])
      setError(`Failed to load submissions from backend: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadProblems = async () => {
    try {
      console.log('Loading problems for submissions...')
      const response = await fetch('http://localhost:8082/api/problems', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Problems loaded for submissions:', data)
      setProblems(data)
    } catch (err) {
      console.error('Failed to load problems for submissions:', err)
      setProblems([])
    }
  }

  const getProblemTitle = (problemId) => {
    console.log('Getting problem title for problemId:', problemId, 'type:', typeof problemId)
    
   
    if (!problemId || problemId === null || problemId === undefined) {
      console.log('ProblemId is null/undefined')
      return 'Unknown Problem'
    }
    
    
    const id = parseInt(problemId)
    console.log('Parsed ID:', id, 'isNaN:', isNaN(id))
    
    
    if (isNaN(id)) {
      console.log('ProblemId is not a valid number')
      return `Problem ${problemId}`
    }
    
    if (!problems || problems.length === 0) {
      console.log('No problems loaded yet')
      return `Problem ${id}`
    }
    
    console.log('Looking for problem with ID:', id, 'in problems:', problems)
    const problem = problems.find(p => p.id === id)
    console.log('Found problem:', problem)
    
    if (problem && problem.title) {
      return problem.title
    } else {
      return `Problem ${id}`
    }
  }

  const getStatusClass = (status) => {
    if (!status) return ''
    const statusLower = status.toLowerCase()
    if (statusLower.includes('accepted')) return 'status-accepted'
    if (statusLower.includes('wrong') || statusLower.includes('error')) return 'status-wrong'
    if (statusLower.includes('pending')) return 'status-pending'
    return ''
  }

  if (loading) {
    return (
      <div className="card">
        <h2>My Submissions</h2>
        <p>Loading submissions from backend...</p>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="card">
        <h2>My Submissions</h2>
        <p>Loading problem information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h2>My Submissions</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button className="btn" onClick={loadSubmissions}>Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>My Submissions</h2>
        <p style={{ color: '#6c757d', fontSize: '16px' }}>View all your code submissions and their results</p>
        <button 
          className="btn" 
          onClick={loadSubmissions}
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Submissions
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#6c757d' }}>No Submissions Yet</h3>
          <p>Submit some code to see your submissions here!</p>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>Go to the Problems page to start coding</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {submissions.map(submission => {
            console.log('Full submission object:', submission)
            return (
              <div key={submission.id} className="submission-item" style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ color: '#2c3e50', margin: '0', fontSize: '18px' }}>Submission #{submission.id}</h3>
                  <span style={{ 
                    backgroundColor: submission.status === 'Accepted' ? '#28a745' : '#dc3545', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {submission.status || 'Unknown'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                  <p><strong>Student:</strong> {submission.studentName || 'Unknown Student'}</p>
                  <p><strong>Problem:</strong> {submission.problem?.title || (submission.problemId ? `Problem ${submission.problemId}` : 'Unknown Problem')}</p>
                  <p><strong>Language:</strong> {submission.language}</p>
                  {submission.marks !== undefined && (
                    <p><strong>Marks:</strong> <span style={{ color: submission.marks >= 8 ? '#28a745' : submission.marks >= 5 ? '#ffc107' : '#dc3545', fontWeight: 'bold' }}>{submission.marks}/10</span></p>
                  )}
                </div>
                <p style={{ color: '#6c757d', fontSize: '14px' }}><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
            
            {submission.testCaseResults && (
              <div style={{ marginTop: '15px' }}>
                <strong>Test Case Results:</strong>
                {(() => {
                  try {
                    const testResults = JSON.parse(submission.testCaseResults);
                    return (
                      <div style={{ marginTop: '10px' }}>
                        {testResults.map((result, index) => (
                          <div key={index} style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '4px', 
                            padding: '10px', 
                            marginBottom: '10px',
                            backgroundColor: result.passed ? '#d4edda' : '#f8d7da'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <strong>Test Case {result.testCaseNumber}</strong>
                              <span style={{ 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontSize: '12px',
                                backgroundColor: result.passed ? '#28a745' : '#dc3545',
                                color: 'white'
                              }}>
                                {result.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px' }}>
                              <p><strong>Input:</strong> <code>{result.input}</code></p>
                              <p><strong>Expected:</strong> <code>{result.expectedOutput}</code></p>
                              <p><strong>Actual:</strong> <code>{result.actualOutput}</code></p>
                              {result.error && (
                                <p style={{ color: 'red' }}><strong>Error:</strong> {result.error}</p>
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
                        {submission.testCaseResults}
                      </div>
                    );
                  }
                })()}
              </div>
            )}
            
            {submission.output && (
              <div>
                <strong>Output:</strong>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px',
                  fontSize: '12px',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {submission.output}
                </pre>
              </div>
            )}
            
            {submission.error && (
              <div>
                <strong>Error:</strong>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px',
                  fontSize: '12px',
                  color: 'red',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {submission.error}
                </pre>
              </div>
            )}
            
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                View Code
              </summary>
              <pre style={{ 
                background: '#f8f9fa', 
                padding: '10px', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '5px',
                fontSize: '12px',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {submission.code}
              </pre>
            </details>
            </div>
          )
        })}
        </div>
      )}
    </div>
  )
}

export default Submissions