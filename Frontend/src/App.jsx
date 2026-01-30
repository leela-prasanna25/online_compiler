import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProblemList from './pages/ProblemList'
import Compiler from './pages/Compiler'
import Submissions from './pages/Submissions'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<ProblemList />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="/submissions" element={<Submissions />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App


