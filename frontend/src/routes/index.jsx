import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <StudentDashboard />
                </PrivateRoute>
            } />

            {/* Other dashboard routes */}
            <Route path="/dashboard/*" element={
                <PrivateRoute>
                    <DashboardLayout>
                        <Routes>
                            <Route path="reports" element={<div>Reports Page</div>} />
                            <Route path="internships" element={<div>Internships Page</div>} />
                            <Route path="evaluations" element={<div>Evaluations Page</div>} />
                            <Route path="profile" element={<div>Profile Page</div>} />
                        </Routes>
                    </DashboardLayout>
                </PrivateRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes; 