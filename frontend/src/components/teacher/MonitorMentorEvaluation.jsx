import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../UI/Card';
import { Button } from '../UI/Button';
import { Star, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import teacherApi from '../../services/teacherApi';

const EvaluationCard = ({ evaluation, onAddComment }) => {
  const renderStars = (score) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < score
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{evaluation.student_name}</h3>
              <p className="text-sm text-gray-500">Mentor: {evaluation.mentor_name}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm ${
              evaluation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              evaluation.status === 'reviewed' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {evaluation.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Overall Score</p>
            <div className="flex items-center space-x-2">
              {renderStars(evaluation.score)}
              <span className="text-sm font-medium text-gray-700">
                {evaluation.score}/5
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Mentor's Comments</p>
            <p className="text-sm text-gray-700">{evaluation.mentor_comments}</p>
          </div>

          {evaluation.teacher_comments && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Your Comments</p>
              <p className="text-sm text-blue-700">{evaluation.teacher_comments}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddComment(evaluation)}
              className="text-blue-600 hover:text-blue-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MonitorMentorEvaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const data = await teacherApi.evaluations.getMentorEvaluations();
      setEvaluations(data);
    } catch (error) {
      toast.error('Failed to load mentor evaluations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setComment(evaluation.teacher_comments || '');
    setShowCommentModal(true);
  };

  const handleSubmitComment = async () => {
    try {
      await teacherApi.evaluations.addComment(selectedEvaluation.id, { comment });
      toast.success('Comment added successfully');
      setShowCommentModal(false);
      fetchEvaluations(); // Refresh the list
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Mentor Evaluations</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {evaluations.length} evaluations
          </span>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No evaluations yet</h3>
            <p className="text-gray-500 mt-1">
              There are no mentor evaluations to review at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {evaluations.map((evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              onAddComment={handleAddComment}
            />
          ))}
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Comment
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your comments..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowCommentModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitComment}
              >
                Submit Comment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitorMentorEvaluation; 