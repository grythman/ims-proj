import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Main Pages
import Dashboard from '../pages/dashboard/Dashboard';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';

// Internship Pages
import Agreement from '../pages/internships/Agreement';
import Plan from '../pages/internships/Plan';
import Reports from '../pages/reports/Reports';
import SubmitReport from '../pages/reports/SubmitReport';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Internship Routes */}
                    <Route path="/internships/agreement" element={<Agreement />} />
                    <Route path="/internships/plan" element={<Plan />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports/submit" element={<SubmitReport />} />
                </Route>
            </Route>

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes; 