import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-6 bg-black min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App