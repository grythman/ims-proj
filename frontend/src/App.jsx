import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DashboardLayout from './layouts/DashboardLayout'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import MentorDashboard from './pages/dashboard/MentorDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

// Role-based dashboard component selector
const DashboardSelector = () => {
  const { user } = useAuth()
  
  switch (user?.role) {
    case 'mentor':
      return <MentorDashboard />
    case 'teacher':
      return <TeacherDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return <StudentDashboard />
  }
}

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardSelector />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App