import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    DocumentTextIcon,
    FunnelIcon,
    PlusIcon,
    ChevronDownIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Reports = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('-submission_date');

    const fetchReports = useCallback(async () => {
        try {
            const response = await api.get('/reports/', {
                params: {
                    status: filter !== 'all' ? filter : undefined,
                    ordering: sortBy
                }
            });
            setReports(response.data);
        } catch (err) {
            setError('Failed to fetch reports');
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    }, [filter, sortBy]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    </div>
                    {user?.user_type === 'student' && (
                        <button
                            onClick={() => navigate('/reports/submit')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Submit Report
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="appearance-none pl-8 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Reports</option>
                                <option value="pending">Pending Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                {user?.user_type === 'student' && (
                                    <option value="draft">Drafts</option>
                                )}
                            </select>
                            <FunnelIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-8 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="-submission_date">Submission Date</option>
                                <option value="type">Report Type</option>
                                <option value="-created_at">Created Date</option>
                            </select>
                            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        className="p-6 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/reports/${report.id}`)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                                    {getStatusIcon(report.status)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {report.title}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                        <span>{report.type_display}</span>
                                        <span>•</span>
                                        <span>
                                            Submitted: {report.submission_date 
                                                ? new Date(report.submission_date).toLocaleDateString()
                                                : 'Not submitted'}
                                        </span>
                                        {report.review_date && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    Reviewed: {new Date(report.review_date).toLocaleDateString()}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {report.feedback && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Feedback: {report.feedback}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                {report.status_display}
                            </span>
                        </div>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No reports found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports; 