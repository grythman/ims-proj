import React from 'react';
import {
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const PreliminaryReportCheck = ({ report, onEdit }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'text-green-600 bg-green-100';
            case 'needs_revision':
                return 'text-red-600 bg-red-100';
            case 'reviewed':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-yellow-600 bg-yellow-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
            case 'needs_revision':
                return <XCircleIcon className="h-5 w-5 text-red-600" />;
            case 'submitted':
                return <ClockIcon className="h-5 w-5 text-yellow-600" />;
            default:
                return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {getStatusIcon(report.status)}
                    <div>
                        <h3 className="text-lg font-medium">Preliminary Report</h3>
                        <p className="text-sm text-gray-500">
                            Submitted on {new Date(report.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
            </div>

            {report.feedback && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                    <p className="text-gray-600">{report.feedback}</p>
                </div>
            )}

            {report.reviewed_by && (
                <div className="mt-4 text-sm text-gray-500">
                    Reviewed by: {report.reviewed_by}
                </div>
            )}

            {report.status === 'needs_revision' && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => onEdit(report)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Report
                    </button>
                </div>
            )}
        </div>
    );
};

export default PreliminaryReportCheck; 