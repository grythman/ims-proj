import React from 'react';
import { Navigate } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MentorDashboard from '../components/dashboard/MentorDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, loading } = useAuth();

    // Show loading spinner while checking auth status
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Show error if no user type
    if (!user.user_type) {
        return (
            <div className="p-4">
                <ErrorMessage message="No user type assigned. Please contact administrator." />
            </div>
        );
    }

    // Render appropriate dashboard based on user type
    const renderDashboard = () => {
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

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderDashboard()}
            </div>
        </div>
    );
};

export default Dashboard; 