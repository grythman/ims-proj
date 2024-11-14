import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../../services/api';
import {
    AcademicCapIcon,
    DocumentTextIcon,
    UserIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    StarIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import { Dialog } from '@headlessui/react';
import SubmitReport from '../reports/SubmitReport';
import DashboardLayout from '../layout/DashboardLayout';
import PreliminaryReportCheck from '../reports/PreliminaryReportCheck';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSubmitReport, setShowSubmitReport] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await getDashboardData('student');
            setData(response);
            setError(null);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderEvaluationScore = (score) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        className={`h-5 w-5 ${
                            index < Math.round(score/20) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                    {score}/100
                </span>
            </div>
        );
    };

    // Separate evaluations by type
    const teacherEvaluations = data?.evaluations?.filter(
        evaluation => evaluation.evaluator_type === 'teacher'
    ) || [];

    const mentorEvaluations = data?.evaluations?.filter(
        evaluation => evaluation.evaluator_type === 'mentor'
    ) || [];

    const handleEditPreliminaryReport = (report) => {
        setShowSubmitReport(true);
        // You can pass the report data to pre-fill the form
    };

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>
            <div className="text-red-600 text-center p-4">
                {error}
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
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
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Reports</h2>
                            <button
                                onClick={() => setShowSubmitReport(true)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                            >
                                Submit Report
                            </button>
                        </div>
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

                {/* Mentor Evaluations Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Mentor Evaluations</h2>
                    <div className="space-y-6">
                        {mentorEvaluations.map((evaluation) => (
                            <div key={evaluation.id} className="border-b pb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <UserIcon className="h-6 w-6 text-emerald-600" />
                                        <div>
                                            <h3 className="font-medium">{evaluation.evaluator_name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(evaluation.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {evaluation.score && renderEvaluationScore(evaluation.score)}
                                </div>

                                {/* Evaluation Categories */}
                                {evaluation.categories && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {Object.entries(evaluation.categories).map(([category, score]) => (
                                            <div key={category} className="bg-gray-50 p-3 rounded">
                                                <div className="text-sm text-gray-600 capitalize">
                                                    {category.replace('_', ' ')}
                                                </div>
                                                {renderEvaluationScore(score)}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Comments Section */}
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                                    <div className="bg-gray-50 p-4 rounded">
                                        <p className="text-gray-600">{evaluation.comments}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => {/* Add discussion feature */}}
                                        className="flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                                    >
                                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                                        Discuss Feedback
                                    </button>
                                </div>
                            </div>
                        ))}
                        {mentorEvaluations.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                No mentor evaluations available yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Teacher Evaluations Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Teacher Evaluations</h2>
                    <div className="space-y-6">
                        {teacherEvaluations.map((evaluation) => (
                            <div key={evaluation.id} className="border-b pb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <UserIcon className="h-6 w-6 text-blue-600" />
                                        <div>
                                            <h3 className="font-medium">{evaluation.evaluator_name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(evaluation.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {evaluation.score && renderEvaluationScore(evaluation.score)}
                                </div>

                                {/* Academic Performance Categories */}
                                {evaluation.categories && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {Object.entries(evaluation.categories).map(([category, score]) => (
                                            <div key={category} className="bg-gray-50 p-3 rounded">
                                                <div className="text-sm text-gray-600 capitalize">
                                                    {category.replace('_', ' ')}
                                                </div>
                                                {renderEvaluationScore(score)}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Academic Recommendations */}
                                {evaluation.recommendations && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Academic Recommendations
                                        </h4>
                                        <div className="bg-blue-50 p-4 rounded">
                                            <p className="text-gray-600">{evaluation.recommendations}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Comments Section */}
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Feedback and Comments
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded">
                                        <p className="text-gray-600">{evaluation.comments}</p>
                                    </div>
                                </div>

                                {/* Areas for Improvement */}
                                {evaluation.improvements && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Areas for Improvement
                                        </h4>
                                        <div className="bg-yellow-50 p-4 rounded">
                                            <ul className="list-disc list-inside space-y-1">
                                                {evaluation.improvements.map((item, index) => (
                                                    <li key={index} className="text-gray-600">{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Academic Progress */}
                                {evaluation.progress_status && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Academic Progress Status
                                        </h4>
                                        <div className={`p-2 rounded text-center font-medium ${
                                            evaluation.progress_status === 'Excellent' ? 'bg-green-100 text-green-800' :
                                            evaluation.progress_status === 'Satisfactory' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {evaluation.progress_status}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {teacherEvaluations.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                No teacher evaluations available yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Preliminary Report Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Preliminary Report Status</h2>
                    {data?.preliminary_report ? (
                        <PreliminaryReportCheck
                            report={data.preliminary_report}
                            onEdit={handleEditPreliminaryReport}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-gray-500">No preliminary report submitted yet</p>
                            <button
                                onClick={() => setShowSubmitReport(true)}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                            >
                                Submit Preliminary Report
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Report Modal */}
                <Dialog
                    open={showSubmitReport}
                    onClose={() => setShowSubmitReport(false)}
                    className="fixed inset-0 z-10 overflow-y-auto"
                >
                    <div className="flex items-center justify-center min-h-screen">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
                            <SubmitReport
                                onClose={() => setShowSubmitReport(false)}
                                onSubmit={() => {
                                    setShowSubmitReport(false);
                                    fetchData(); // Refresh dashboard data
                                }}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard; 