import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDashboardData } from '../services/api';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalUsers: 0,
            totalCompanies: 0,
            activeProjects: 0,
        },
        recentActivity: [],
        notifications: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await getDashboardData();
            setDashboardData(data);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <DashboardContext.Provider
            value={{
                ...dashboardData,
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