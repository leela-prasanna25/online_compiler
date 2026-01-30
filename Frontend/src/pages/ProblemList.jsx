import React, { useState, useEffect } from 'react'
import { problemAPI } from '../services/api'

function ProblemList() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProblems()
  }, []) 

  const loadProblems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading problems from backend...')
      console.log('API URL:', 'http://localhost:8082/api/problems')
      
      
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
      console.log('Backend response:', data)
      console.log('Response type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      console.log('Data length:', data?.length || 0)
      
      if (Array.isArray(data)) {
        setProblems(data)
        console.log('Problems loaded successfully:', data.length, 'problems')
      } else {
        console.error('Response is not an array:', data)
        setError('Invalid response format from backend')
        setProblems([])
      }
    } catch (err) {
      console.error('Failed to load problems from backend:', err)
      setError(`Failed to load problems from backend: ${err.message}`)
      setProblems([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <h2>Coding Problems</h2>
        <p>Loading problems from backend...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h2>Coding Problems</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button className="btn" onClick={loadProblems}>Try Again</button>
      </div>
    )
  }

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Coding Problems</h2>
        <p style={{ color: '#6c757d', fontSize: '16px' }}>Select a problem to start coding and test your skills</p>
        <button 
          className="btn" 
          onClick={loadProblems}
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Problems
        </button>
      </div>

      {problems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#dc3545' }}>No Problems Available</h3>
          <p>Make sure the backend is running on port 8082</p>
          <button className="btn" onClick={loadProblems}>Try Again</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {problems.map(problem => (
            <div key={problem.id} className="problem-item" style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ color: '#2c3e50', margin: '0', fontSize: '20px' }}>{problem.title}</h3>
                <span style={{ 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  Problem #{problem.id}
                </span>
              </div>
              <p style={{ color: '#495057', marginBottom: '15px', lineHeight: '1.5' }}>{problem.description}</p>
            
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
            
            {problem.sampleTestCases && (
              <div>
                <strong>Sample Test Cases:</strong>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px',
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {problem.sampleTestCases}
                </pre>
              </div>
            )}
            
              <button 
                className="btn btn-success" 
                onClick={() => window.location.href = `/compiler?problem=${problem.id}`}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginTop: '15px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                Solve This Problem
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProblemList