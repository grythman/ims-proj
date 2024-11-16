import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import StudentDashboard from './pages/dashboard/StudentDashboard'

// Placeholder components for other routes
const Reports = () => <div>Reports Page</div>
const Evaluations = () => <div>Evaluations Page</div>
const Settings = () => <div>Settings Page</div>

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App