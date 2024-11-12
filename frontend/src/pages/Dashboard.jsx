import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import MentorDashboard from '../components/dashboard/MentorDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.user_type) {
        return <ErrorMessage message="No user type assigned. Please contact administrator." />;
    }

    // Render appropriate dashboard based on user type
    switch (user.user_type) {
        case 'teacher':
            return <TeacherDashboard />;
        case 'mentor':
            return <MentorDashboard />;
        case 'student':
            return <StudentDashboard />;
        default:
            return <ErrorMessage message={`Invalid user type: ${user.user_type}`} />;
    }
};

export default Dashboard; 