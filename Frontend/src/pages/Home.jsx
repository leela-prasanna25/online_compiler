import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 100px)', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        width: '100%',
        textAlign: 'center',
        border: '3px solid #3b82f6',
        borderRadius: '15px',
        padding: '40px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Welcome to the Online Compiler</h2>
        <p style={{ fontSize: '1rem', marginBottom: '20px', lineHeight: '1.5' }}>This platform allows you to code, compile, and test your programs in multiple languages.</p>
        <ul style={{ margin: '15px 0', paddingLeft: '20px', textAlign: 'left', fontSize: '1rem', lineHeight: '1.5' }}>
          <li style={{ marginBottom: '8px' }}>Access a wide range of coding problems</li>
          <li style={{ marginBottom: '8px' }}>Write, run, and debug your code instantly</li>
          <li style={{ marginBottom: '8px' }}>Check results and improve your logic</li>
        </ul>
        <div style={{ marginTop: '25px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Get Started</h3>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/problems" className="btn" style={{ padding: '12px 25px', fontSize: '1rem' }}>View Problems</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home