import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import StudentDashboardLayout from './layouts/StudentDashboardLayout'
import MentorDashboardLayout from './layouts/MentorDashboardLayout'
import TeacherDashboardLayout from './layouts/TeacherDashboardLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'

// Pages
import HomePage from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboards
import StudentDashboard from './pages/dashboard/StudentDashboard'
import MentorDashboard from './pages/dashboard/MentorDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'

// Components
import SubmitReport from './components/student/SubmitReport'
import RegisterInternship from './components/student/RegisterInternship'
import EditProfile from './components/student/EditProfile'
import MonitorStudents from './components/mentor/MonitorStudents'
import ReportReview from './components/mentor/ReportReview'
import DataStatistics from './components/mentor/DataStatistics'
import MonitorStudentProgress from './components/teacher/MonitorStudentProgress'
import FinalEvaluation from './components/teacher/FinalEvaluation'
import StudentAdvice from './components/mentor/StudentAdvice'

// Auth & Protection
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

const App = () => {
  const { user, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  // Function to get the appropriate layout and dashboard based on user role
  const getDashboardContent = () => {
    switch (user?.role) {
      case 'mentor':
        return {
          Layout: MentorDashboardLayout,
          Dashboard: MentorDashboard
        }
      case 'teacher':
        return {
          Layout: TeacherDashboardLayout,
          Dashboard: TeacherDashboard
        }
      case 'admin':
        return {
          Layout: AdminDashboardLayout,
          Dashboard: AdminDashboard
        }
      default:
        return {
          Layout: StudentDashboardLayout,
          Dashboard: StudentDashboard
        }
    }
  }

  const { Layout, Dashboard } = getDashboardContent()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    {/* Add nested routes based on user role */}
                    {user?.role === 'student' && (
                      <>
                        <Route path="reports" element={<SubmitReport />} />
                        <Route path="internship" element={<RegisterInternship />} />
                        <Route path="profile" element={<EditProfile />} />
                      </>
                    )}
                    {user?.role === 'mentor' && (
                      <>
                        <Route path="monitor" element={<MonitorStudents />} />
                        <Route path="review" element={<ReportReview />} />
                        <Route path="statistics" element={<DataStatistics />} />
                        <Route path="advice" element={<StudentAdvice />} />
                      </>
                    )}
                    {user?.role === 'teacher' && (
                      <>
                        <Route path="progress" element={<MonitorStudentProgress />} />
                        <Route path="evaluations" element={<FinalEvaluation />} />
                      </>
                    )}
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App