import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './shared/StatCard';
import ActionCard from './shared/ActionCard';
import { useDashboard } from '../../context/DashboardContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { 
    DocumentTextIcon,
    ClockIcon,
    ChartBarIcon,
    CalendarIcon,
    CheckCircleIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { dashboardData, loading, error } = useDashboard();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    // Define navigation handlers
    const handleSubmitReport = () => {
        navigate('/reports/submit', { replace: true }); // Add replace: true to prevent back navigation
    };

    const handleLogHours = () => {
        navigate('/tasks/log-hours', { replace: true });
    };

    const handleViewResources = () => {
        navigate('/resources', { replace: true });
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome, {dashboardData?.student_name || 'Student'}</h1>
                        <p className="mt-2 text-indigo-100">
                            Week {dashboardData?.current_week || 0} of {dashboardData?.total_weeks || 0} - 
                            {dashboardData?.internship_status === 'active' ? ' Active' : ' Inactive'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleSubmitReport}
                            className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                        >
                            <DocumentTextIcon className="h-5 w-5 inline-block mr-2" />
                            Submit Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${dashboardData?.overall_progress || 0}%` }}
                    />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    {dashboardData?.overall_progress || 0}% Complete
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Tasks Completed"
                    value={`${dashboardData?.completed_tasks || 0}/${dashboardData?.total_tasks || 0}`}
                    icon={<CheckCircleIcon className="h-6 w-6" />}
                    className="bg-white"
                />
                <StatCard
                    title="Hours Logged"
                    value={dashboardData?.hours_logged || 0}
                    icon={<ClockIcon className="h-6 w-6" />}
                    className="bg-white"
                />
                <StatCard
                    title="Next Meeting"
                    value={dashboardData?.next_meeting?.time || 'None'}
                    icon={<CalendarIcon className="h-6 w-6" />}
                    description={dashboardData?.next_meeting?.mentor || ''}
                    className="bg-white"
                />
                <StatCard
                    title="Learning Progress"
                    value={`${dashboardData?.learning_progress || 0}%`}
                    icon={<ChartBarIcon className="h-6 w-6" />}
                    className="bg-white"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ActionCard
                    title="Submit Weekly Report"
                    description="Document your progress and learnings"
                    icon={<DocumentTextIcon className="h-5 w-5" />}
                    onClick={handleSubmitReport}
                />
                <ActionCard
                    title="Log Hours"
                    description="Record your work time"
                    icon={<ClockIcon className="h-5 w-5" />}
                    onClick={handleLogHours}
                />
                <ActionCard
                    title="Learning Resources"
                    description="Access study materials"
                    icon={<BookOpenIcon className="h-5 w-5" />}
                    onClick={handleViewResources}
                />
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {dashboardData?.upcoming_tasks?.map((task, index) => (
                            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${
                                        task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                        <CheckCircleIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                                        <p className="text-sm text-gray-500">{task.due_date}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard; 