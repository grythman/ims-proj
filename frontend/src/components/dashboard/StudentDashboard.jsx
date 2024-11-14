import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../../services/api';
import {
    AcademicCapIcon,
    DocumentTextIcon,
    UserIcon,
    ChartBarIcon,
    ClockIcon,
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDashboardData();
                setData(response);
                setError(null);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Profile Completion Status */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Completion</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(data?.profile || {}).map(([key, completed]) => (
                        <div key={key} className="flex items-center space-x-2">
                            {completed ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : (
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span className="capitalize">{key.replace('_', ' ')}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Internship */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Current Internship</h2>
                {data?.internship ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{data.internship.title}</p>
                                <p className="text-gray-600">{data.internship.organization?.name}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                                {data.internship.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Start Date</p>
                                <p>{new Date(data.internship.start_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">End Date</p>
                                <p>{new Date(data.internship.end_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-gray-500">No active internship</p>
                        <button
                            onClick={() => navigate('/internships/register')}
                            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                        >
                            Register for Internship
                        </button>
                    </div>
                )}
            </div>

            {/* Reports & Evaluations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Reports */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
                    <div className="space-y-4">
                        {data?.reports?.map((report) => (
                            <div key={report.id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-3">
                                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{report.title}</p>
                                        <p className="text-sm text-gray-500">{report.report_type}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    report.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {report.status}
                                </span>
                            </div>
                        ))}
                        {(!data?.reports || data.reports.length === 0) && (
                            <p className="text-center text-gray-500">No reports submitted yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Evaluations */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Evaluations</h2>
                    <div className="space-y-4">
                        {data?.evaluations?.map((evaluation) => (
                            <div key={evaluation.id} className="border-b pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                        <span className="font-medium">{evaluation.evaluator_name}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(evaluation.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600">{evaluation.comments}</p>
                            </div>
                        ))}
                        {(!data?.evaluations || data.evaluations.length === 0) && (
                            <p className="text-center text-gray-500">No evaluations received yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard; 