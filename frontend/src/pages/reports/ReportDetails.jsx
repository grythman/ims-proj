import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import {
    DocumentTextIcon,
    ArrowLeftIcon,
    ChatBubbleLeftIcon,
    PaperClipIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DownloadIcon
} from '@heroicons/react/24/outline';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getTheme, isTeacher, isMentor } = useRole();
    const theme = getTheme();
    const [comment, setComment] = useState('');

    // Sample data - replace with API call
    const report = {
        id,
        title: 'Weekly Progress Report',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        student: 'John Doe',
        mentor: 'Jane Smith',
        type: 'weekly',
        status: 'pending',
        submitted_at: '2024-03-15',
        attachments: [
            { id: 1, name: 'progress_report.pdf', size: '2.4 MB' },
            { id: 2, name: 'screenshots.zip', size: '5.1 MB' }
        ],
        comments: [
            {
                id: 1,
                author: 'Jane Smith',
                role: 'mentor',
                content: 'Great progress this week! Keep up the good work.',
                timestamp: '2024-03-15T14:30:00Z'
            }
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'text-green-700 bg-green-50 ring-green-600/20';
            case 'rejected':
                return 'text-red-700 bg-red-50 ring-red-600/20';
            case 'pending':
                return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20';
            default:
                return 'text-gray-700 bg-gray-50 ring-gray-600/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
        }
    };

    const handleApprove = () => {
        // Add approval logic
        console.log('Approving report:', id);
    };

    const handleReject = () => {
        // Add rejection logic
        console.log('Rejecting report:', id);
    };

    const handleComment = (e) => {
        e.preventDefault();
        // Add comment logic
        console.log('Adding comment:', comment);
        setComment('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`bg-gradient-to-r ${theme.gradient} rounded-lg shadow-lg p-6 text-white`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/reports')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">{report.title}</h1>
                            <p className="mt-1 text-white/80">
                                Submitted by {report.student} on {report.submitted_at}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Report Content */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="prose max-w-none">
                            {report.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Attachments</h2>
                        <div className="space-y-3">
                            {report.attachments.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <PaperClipIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                            <p className="text-xs text-gray-500">{file.size}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <DownloadIcon className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Comments</h2>
                        <div className="space-y-4">
                            {report.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                    <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium text-gray-900">{comment.author}</span>
                                                <span className="mx-2 text-gray-300">•</span>
                                                <span className="text-sm text-gray-500">{comment.role}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-gray-600">{comment.content}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Add Comment Form */}
                            <form onSubmit={handleComment} className="mt-4">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    rows={3}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className={`px-4 py-2 bg-${theme.primary}-600 text-white rounded-md hover:bg-${theme.primary}-700 transition-colors`}
                                    >
                                        Add Comment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions */}
                    {(isTeacher || isMentor) && report.status === 'pending' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={handleApprove}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircleIcon className="h-5 w-5" />
                                    Approve Report
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <XCircleIcon className="h-5 w-5" />
                                    Reject Report
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Report Details</h2>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 capitalize">{report.type}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Student</dt>
                                <dd className="mt-1 text-sm text-gray-900">{report.student}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Mentor</dt>
                                <dd className="mt-1 text-sm text-gray-900">{report.mentor}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                                <dd className="mt-1 text-sm text-gray-900">{report.submitted_at}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails; 