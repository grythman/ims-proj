import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './shared/StatCard';
import ActionCard from './shared/ActionCard';
import { useDashboard } from '../../context/DashboardContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { 
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    CalendarIcon,
    ChartBarIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const MentorDashboard = () => {
    const navigate = useNavigate();
    const { dashboardData, loading, error } = useDashboard();
    const [selectedView, setSelectedView] = useState('current');

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-6 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome, {dashboardData?.mentor_name || 'Mentor'}</h1>
                        <p className="mt-2 text-purple-100">
                            Managing {dashboardData?.assigned_interns || 0} interns
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedView('current')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                selectedView === 'current' 
                                    ? 'bg-white text-purple-600' 
                                    : 'bg-purple-500 text-white hover:bg-purple-400'
                            }`}
                        >
                            Current Interns
                        </button>
                        <button
                            onClick={() => setSelectedView('past')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                selectedView === 'past' 
                                    ? 'bg-white text-purple-600' 
                                    : 'bg-purple-500 text-white hover:bg-purple-400'
                            }`}
                        >
                            Past Interns
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Assigned Interns"
                    value={dashboardData?.assigned_interns || 0}
                    icon={<UserGroupIcon className="h-6 w-6" />}
                    trend={dashboardData?.intern_growth}
                    trendLabel="from last month"
                    className="bg-white"
                />
                <StatCard
                    title="Active Interns"
                    value={dashboardData?.active_interns || 0}
                    icon={<CheckCircleIcon className="h-6 w-6" />}
                    description="Currently mentoring"
                    className="bg-white"
                />
                <StatCard
                    title="Pending Reviews"
                    value={dashboardData?.pending_reviews || 0}
                    icon={<ClipboardDocumentCheckIcon className="h-6 w-6" />}
                    urgent={dashboardData?.pending_reviews > 5}
                    className="bg-white"
                />
                <StatCard
                    title="Success Rate"
                    value={`${dashboardData?.success_rate || 0}%`}
                    icon={<ChartBarIcon className="h-6 w-6" />}
                    trend="+5%"
                    trendLabel="vs last term"
                    className="bg-white"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Intern List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold">Current Interns</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {dashboardData?.interns?.map((intern, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${getStatusColor(intern.status)}`}>
                                            {intern.status === 'active' ? (
                                                <CheckCircleIcon className="h-5 w-5" />
                                            ) : (
                                                <ClockIcon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{intern.name}</h3>
                                            <p className="text-sm text-gray-500">{intern.project}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(intern.status)}`}>
                                            {intern.status}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/interns/${intern.id}`)}
                                            className="text-purple-600 hover:text-purple-800"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <ActionCard
                                title="Schedule Meeting"
                                description="Set up intern consultations"
                                icon={<CalendarIcon className="h-5 w-5" />}
                                onClick={() => navigate('/meetings/schedule')}
                            />
                            <ActionCard
                                title="Review Reports"
                                description={`${dashboardData?.pending_reviews || 0} reports pending`}
                                icon={<DocumentTextIcon className="h-5 w-5" />}
                                onClick={() => navigate('/reports')}
                                urgent={dashboardData?.pending_reviews > 5}
                            />
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
                        <div className="space-y-4">
                            {dashboardData?.upcoming_tasks?.map((task, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${
                                            task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            <ExclamationCircleIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{task.title}</p>
                                            <p className="text-sm text-gray-500">{task.due_date}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard; 