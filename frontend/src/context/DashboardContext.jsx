import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { get } from '../services/api';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        if (!user?.user_type) {
            setLoading(false);
            return;
        }
        
        try {
            const response = await get(`/dashboard/${user.user_type.toLowerCase()}/`);
            setDashboardData(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.user_type]);

    const refreshDashboard = useCallback(() => {
        setLoading(true);
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <DashboardContext.Provider value={{
            dashboardData,
            loading,
            error,
            refreshDashboard
        }}>
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