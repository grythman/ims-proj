import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import PrivateRoute from './PrivateRoute';
import SubmitReport from '../components/reports/SubmitReport';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<div>Forgot Password</div>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path="/internships" element={
                <PrivateRoute>
                    <Navigate to="/dashboard/internships" replace />
                </PrivateRoute>
            } />
            <Route path="/mentors" element={
                <PrivateRoute>
                    <Navigate to="/dashboard/mentors" replace />
                </PrivateRoute>
            } />
            <Route path="/progress" element={
                <PrivateRoute>
                    <Navigate to="/dashboard/progress" replace />
                </PrivateRoute>
            } />
            <Route path="/analytics" element={
                <PrivateRoute>
                    <Navigate to="/dashboard/analytics" replace />
                </PrivateRoute>
            } />

            <Route path="/reports/submit" element={
                <PrivateRoute>
                    <SubmitReport />
                </PrivateRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes; 