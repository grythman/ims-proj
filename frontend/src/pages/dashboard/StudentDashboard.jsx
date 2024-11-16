import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card';
import { toast } from 'react-hot-toast';
import studentApi from '../../services/studentApi';
import ViewMentorEvaluation from '../../components/student/ViewMentorEvaluation';
import ViewTeacherEvaluation from '../../components/student/ViewTeacherEvaluation';
import PreliminaryReportCheck from '../../components/student/PreliminaryReportCheck';
import ViewInternshipDuration from '../../components/student/ViewInternshipDuration';
import { useAuth } from '../../context/AuthContext';

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

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    reportsSubmitted: 0,
    daysRemaining: 0,
    overallProgress: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const overview = await studentApi.dashboard.getOverview();
        const stats = await studentApi.dashboard.getStats();
        const activities = await studentApi.dashboard.getActivities();

        setDashboardData({
          ...overview,
          ...stats,
          recentActivity: activities
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Reports Submitted",
      value: dashboardData.reportsSubmitted,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Days Remaining",
      value: dashboardData.daysRemaining,
      icon: Calendar,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Overall Progress",
      value: `${dashboardData.overallProgress}%`,
      icon: BarChart3,
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || 'Student'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your internship progress and tasks
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Submit Report</h3>
                <p className="text-sm text-gray-500 mt-1">Upload your weekly or monthly report</p>
              </div>
              <Button
                variant="outline"
                as={Link}
                to="/dashboard/reports"
                className="text-blue-600"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-medium text-gray-900">Register Internship</h3>
                <p className="text-sm text-gray-500 mt-1">Register for a new internship position</p>
              </div>
              <Button
                variant="outline"
                as={Link}
                to="/dashboard/internship"
                className="text-emerald-600"
              >
                Register
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900">Preliminary Check</h3>
                <p className="text-sm text-gray-500 mt-1">Submit preliminary report check</p>
              </div>
              <Button
                variant="outline"
                className="text-purple-600"
                onClick={() => document.getElementById('preliminary-check').scrollIntoView({ behavior: 'smooth' })}
              >
                Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Duration */}
      <div className="grid gap-6 md:grid-cols-2">
        <ViewInternshipDuration />
        <PreliminaryReportCheck />
      </div>

      {/* Evaluations */}
      <div className="grid gap-6 md:grid-cols-2">
        <ViewMentorEvaluation />
        <ViewTeacherEvaluation />
      </div>

      {/* Recent Activity */}
      {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;