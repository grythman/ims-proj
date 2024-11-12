import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '../common/LoadingSpinner';

const DashboardLayout = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    const getLayoutTheme = () => {
        switch (user?.user_type) {
            case 'teacher':
                return {
                    bgColor: 'bg-blue-50',
                    accentColor: 'border-blue-600',
                    headerGradient: 'from-blue-600 to-blue-800'
                };
            case 'mentor':
                return {
                    bgColor: 'bg-purple-50',
                    accentColor: 'border-purple-600',
                    headerGradient: 'from-purple-600 to-purple-800'
                };
            case 'student':
                return {
                    bgColor: 'bg-indigo-50',
                    accentColor: 'border-indigo-600',
                    headerGradient: 'from-indigo-600 to-indigo-800'
                };
            default:
                return {
                    bgColor: 'bg-gray-50',
                    accentColor: 'border-gray-600',
                    headerGradient: 'from-gray-600 to-gray-800'
                };
        }
    };

    const theme = getLayoutTheme();

    return (
        <div className={`min-h-screen ${theme.bgColor}`}>
            <Header theme={theme} />
            <div className="flex">
                <Sidebar theme={theme} />
                <main className="flex-1 p-8 overflow-auto">
                    <div className={`max-w-7xl mx-auto border-l-4 ${theme.accentColor} pl-4`}>
                        {/* Role Label */}
                        <div className="mb-6">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${theme.headerGradient} text-white`}>
                                {user?.user_type?.charAt(0).toUpperCase() + user?.user_type?.slice(1)} Dashboard
                            </span>
                        </div>
                        
                        {/* Main Content */}
                        <div className="bg-white rounded-lg shadow-lg">
                            {children || <Outlet />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 