import React, { useState } from 'react';
import { reviewMentorEvaluation } from '../../services/api';

const MentorEvaluationReview = ({ evaluation, onClose, onSubmit }) => {
    const [teacherComments, setTeacherComments] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await reviewMentorEvaluation(evaluation.id, {
                teacher_comments: teacherComments
            });
            onSubmit();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                        Review Mentor Evaluation
                    </h3>
                    <div className="mb-6">
                        <h4 className="font-medium mb-2">Mentor's Evaluation Details</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Performance Rating</p>
                                <p className="font-medium">{evaluation.performance_rating}/5</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Attendance Rating</p>
                                <p className="font-medium">{evaluation.attendance_rating}/5</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Initiative Rating</p>
                                <p className="font-medium">{evaluation.initiative_rating}/5</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Teamwork Rating</p>
                                <p className="font-medium">{evaluation.teamwork_rating}/5</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">Mentor's Comments</p>
                            <p className="mt-1 p-2 bg-gray-50 rounded">{evaluation.comments}</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Your Comments
                            </label>
                            <textarea
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                rows="4"
                                value={teacherComments}
                                onChange={(e) => setTeacherComments(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="mb-4 text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MentorEvaluationReview; 