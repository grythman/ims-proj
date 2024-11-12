import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    AcademicCapIcon,
    ClipboardDocumentCheckIcon,
    UserGroupIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsResponse, reviewsResponse, activitiesResponse] = await Promise.all([
                api.get('/api/internships/teacher/statistics/'),
                api.get('/api/internships/teacher/pending-reviews/'),
                api.get('/api/dashboard/activities/')
            ]);

            setStats(statsResponse.data);
            setPendingReviews(reviewsResponse.data);
            setRecentActivities(activitiesResponse.data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Students
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats?.total_internships || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Active Internships
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats?.active_internships || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pending Reviews
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats?.pending_reports || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ChartBarIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Average Performance
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats?.average_ratings?.avg_performance?.toFixed(1) || 'N/A'}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Pending Reviews
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {pendingReviews.map((review) => (
                            <li key={review.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/teacher/reviews/${review.id}`)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-400" />
                                        <p className="ml-2 text-sm font-medium text-gray-900">
                                            {review.student.full_name}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 text-gray-400" />
                                        <p className="ml-2 text-sm text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {pendingReviews.length === 0 && (
                            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                No pending reviews
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Activities
                    </h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {recentActivities.map((activity) => (
                            <li key={activity.id} className="px-4 py-4 sm:px-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.description}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {activity.user_name} • {new Date(activity.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;