import React from 'react';
import { Dialog } from '@headlessui/react';
import { UserIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const ReportDetailView = ({ report, onClose }) => {
    return (
        <Dialog
            open={true}
            onClose={onClose}
            className="fixed inset-0 z-10 overflow-y-auto"
        >
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 p-6">
                    <div className="mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <Dialog.Title className="text-xl font-semibold text-gray-900">
                                    {report.title}
                                </Dialog.Title>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <UserIcon className="h-4 w-4 mr-1" />
                                    {report.student_name}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-gray-500 flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {new Date(report.submitted_at).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center mt-1">
                                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                                    {report.report_type}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="prose max-w-none mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Report Content</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            {report.content}
                        </div>
                    </div>

                    {report.attachments && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Attachments</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {/* Render attachments here */}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ReportDetailView; 