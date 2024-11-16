import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  ChartBar,
  Calendar
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card';
import { toast } from 'react-hot-toast';
import mentorApi from '../../services/mentorApi';
import MonitorStudents from '../../components/mentor/MonitorStudents';

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

const MentorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeInternships: 0,
    pendingReports: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await mentorApi.dashboard.getOverview();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Assigned Students",
      value: dashboardData.totalStudents,
      icon: Users,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Internships",
      value: dashboardData.activeInternships,
      icon: Calendar,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Pending Reports",
      value: dashboardData.pendingReports,
      icon: FileText,
      gradient: "from-yellow-500 to-yellow-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Mentor</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor and guide your assigned students</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Student Monitoring Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Student Progress</h2>
          <p className="text-sm text-gray-500">Monitor your assigned students' internship progress</p>
        </div>
        <MonitorStudents />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <p className="text-sm text-gray-500">Latest updates from your students</p>
        </div>
        <div className="space-y-4">
          {dashboardData.recentActivities.map((activity, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'report' ? 'bg-blue-100' :
                    activity.type === 'evaluation' ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'report' ? <FileText className="h-5 w-5 text-blue-600" /> :
                     activity.type === 'evaluation' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                     <Clock className="h-5 w-5 text-gray-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.student_name}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <span className="ml-auto text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Review Reports</h3>
                <p className="text-sm text-gray-500">Check pending student reports</p>
              </div>
              <Button
                variant="primary"
                as={Link}
                to="/mentor/reports"
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Student Evaluations</h3>
                <p className="text-sm text-gray-500">Provide feedback and evaluations</p>
              </div>
              <Button
                variant="primary"
                as={Link}
                to="/mentor/evaluations"
              >
                Evaluate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Schedule Meetings</h3>
                <p className="text-sm text-gray-500">Plan meetings with students</p>
              </div>
              <Button
                variant="primary"
                as={Link}
                to="/mentor/schedule"
              >
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard; 