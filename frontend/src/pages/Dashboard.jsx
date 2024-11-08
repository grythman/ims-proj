import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalInternships: 0,
        activeInternships: 0,
        totalCompanies: 0,
        pendingApplications: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats/');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    title="Total Internships"
                    value={stats.totalInternships}
                    color="bg-blue-500"
                />
                <DashboardCard
                    title="Active Internships"
                    value={stats.activeInternships}
                    color="bg-green-500"
                />
                <DashboardCard
                    title="Total Companies"
                    value={stats.totalCompanies}
                    color="bg-purple-500"
                />
                <DashboardCard
                    title="Pending Applications"
                    value={stats.pendingApplications}
                    color="bg-yellow-500"
                />
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value, color }) => (
    <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

export default Dashboard; 