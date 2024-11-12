import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import MentorDashboard from '../../components/dashboard/MentorDashboard';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useRole } from '../../hooks/useRole';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const { isAdmin, isTeacher, isMentor, isStudent } = useRole();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" replace />;

    if (isAdmin) return <AdminDashboard />;
    if (isTeacher) return <TeacherDashboard />;
    if (isMentor) return <MentorDashboard />;
    if (isStudent) return <StudentDashboard />;

    return <ErrorMessage message="Invalid user type" />;
};

export default Dashboard; 