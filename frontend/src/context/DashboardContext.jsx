import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDashboardData } from '../services/api';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            if (!user?.user_type) {
                throw new Error('User type not set');
            }
            const data = await getDashboardData(user.user_type);
            setDashboardData(data);
            setError(null);
        } catch (err) {
            console.error('Dashboard error:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    return (
        <DashboardContext.Provider
            value={{
                data: dashboardData,
                loading,
                error,
                refreshData: fetchDashboardData,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}; 