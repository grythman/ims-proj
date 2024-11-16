import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Users,
  FileText,
  ChartBar,
  CheckCircle,
  AlertCircle,
  Clock,
  Search
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card';
import { toast } from 'react-hot-toast';
import teacherApi from '../../services/teacherApi';
import MonitorMentorEvaluation from '../../components/teacher/MonitorMentorEvaluation';
import MonitorStudentProgress from '../../components/teacher/MonitorStudentProgress';

// Create StatCard component for reuse
const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
  <Card className={`bg-gradient-to-br ${gradient} text-white`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
      <Icon className="h-4 w-4 text-white/70" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

// Create ReportCard component
const ReportCard = ({ report, onReview }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            report.status === 'pending' ? 'bg-yellow-100' : 
            report.status === 'approved' ? 'bg-green-100' : 
            'bg-red-100'
          }`}>
            {report.status === 'pending' ? <Clock className="h-5 w-5 text-yellow-600" /> :
             report.status === 'approved' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
             <AlertCircle className="h-5 w-5 text-red-600" />}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{report.student_name}</h3>
            <p className="text-sm text-gray-500">{report.report_type}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReview(report)}
        >
          Review
        </Button>
      </div>
    </CardContent>
  </Card>
);

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    pendingReports: 0,
    completedEvaluations: 0,
    recentReports: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await teacherApi.dashboard.getOverview();
        setDashboardData(data);
        setFilteredReports(data.recentReports);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = dashboardData.recentReports.filter(report => 
      report.student_name.toLowerCase().includes(query.toLowerCase()) ||
      report.report_type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleReviewReport = async (report) => {
    try {
      // Navigate to review page or open modal
      // This is where you'd implement the review functionality
      toast.success('Opening report for review...');
    } catch (error) {
      toast.error('Failed to open report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: dashboardData.totalStudents,
      icon: Users,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Pending Reports",
      value: dashboardData.pendingReports,
      icon: FileText,
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Completed Evaluations",
      value: dashboardData.completedEvaluations,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Teacher</h1>
        <p className="mt-1 text-sm text-gray-500">Here's an overview of your students' progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onReview={handleReviewReport}
            />
          ))}
        </div>
      </div>

      {/* Mentor Evaluations Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Mentor Evaluations</h2>
          <p className="text-sm text-gray-500">Monitor and review mentor evaluations</p>
        </div>
        <MonitorMentorEvaluation />
      </div>

      {/* Student Progress Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Student Progress</h2>
          <p className="text-sm text-gray-500">Monitor and track student internship progress</p>
        </div>
        <MonitorStudentProgress />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Evaluate Reports</h3>
                <p className="text-sm text-gray-500">Review and grade student reports</p>
              </div>
              <Button variant="primary">Start Review</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Student Progress</h3>
                <p className="text-sm text-gray-500">Track internship progress</p>
              </div>
              <Button variant="primary">View Progress</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Generate Reports</h3>
                <p className="text-sm text-gray-500">Create evaluation reports</p>
              </div>
              <Button variant="primary">Generate</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard; 