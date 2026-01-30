import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img 
          src="/vijay-logo.png" 
          alt="Vijay Software Solutions" 
          style={{ 
            height: '45px', 
            width: '45px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid white'
          }}
        />
        <h1 style={{ fontFamily: 'Roboto Slab, serif', fontSize: '36px', fontWeight: '600' }}>
          Online Compiler
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link to="/">Home</Link>
        <Link to="/problems">Problems</Link>
        <Link to="/compiler">Compiler</Link>
        <Link to="/submissions">Submissions</Link>
      </div>
    </nav>
  )
}
export default Navbar