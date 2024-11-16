import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  Calendar,
  ClipboardEdit,
  FileCheck,
  GraduationCap,
  Menu,
  Search,
  Users
} from 'lucide-react'
import Button from '../../components/UI/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import Progress from '../../components/UI/Progress'
import studentApi from '../../services/studentApi'
import { toast } from 'react-hot-toast'
import ViewMentorEvaluation from '../../components/student/ViewMentorEvaluation';
import ViewTeacherEvaluation from '../../components/student/ViewTeacherEvaluation';
import PreliminaryReportCheck from '../../components/student/PreliminaryReportCheck';
import ViewInternshipDuration from '../../components/student/ViewInternshipDuration';
import { useAuth } from '../../context/AuthContext';

// Create HeaderButton component
const HeaderButton = ({ icon: Icon, children, ...props }) => (
  <Button
    variant="ghost"
    size="sm"
    className="text-gray-500 hover:text-gray-700"
    {...props}
  >
    {Icon && <Icon className="h-5 w-5" />}
    {children && <span className="ml-2">{children}</span>}
  </Button>
);

// Create QuickAction component for reuse
const QuickAction = ({ icon: Icon, title, description, onClick, color = "emerald" }) => (
  <Card className="group relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-r from-${color}-500/10 to-${color}-500/5 opacity-0 transition-opacity group-hover:opacity-100`} />
    <CardHeader>
      <div className={`rounded-lg bg-${color}-500/10 p-2 w-fit`}>
        <Icon className={`h-6 w-6 text-${color}-500`} />
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
      <p className="text-sm text-gray-500">{description}</p>
    </CardHeader>
    <CardContent>
      <Button
        variant="secondary"
        className={`w-full bg-${color}-500/10 hover:bg-${color}-500/20 text-${color}-500`}
        onClick={onClick}
      >
        {title}
      </Button>
    </CardContent>
  </Card>
);

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

// Create ProfileCircle component
const ProfileCircle = ({ user }) => {
  const initials = user?.first_name && user?.last_name 
    ? `${user.first_name[0]}${user.last_name[0]}`
    : user?.username?.[0] || '?';

  return (
    <div className="relative group">
      {user?.profile_picture ? (
        <img
          src={user.profile_picture}
          alt={user.username}
          className="h-10 w-10 rounded-full object-cover border-2 border-emerald-200 hover:border-emerald-500 transition-colors duration-200"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 hover:border-emerald-500 transition-colors duration-200">
          <span className="text-sm font-medium text-emerald-600">
            {initials.toUpperCase()}
          </span>
        </div>
      )}
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
        <Link
          to="/dashboard/edit-profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Edit Profile
        </Link>
        <button
          onClick={() => useAuth().logout()}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    reportsSubmitted: 0,
    daysRemaining: 0,
    overallProgress: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let isSubscribed = true;

    const fetchDashboardData = async () => {
      try {
        const overview = await studentApi.dashboard.getOverview()
        const stats = await studentApi.dashboard.getStats()
        const activities = await studentApi.dashboard.getActivities()
        const notifs = await studentApi.notifications.getAll()

        if (isSubscribed) {
          setDashboardData({
            ...overview,
            ...stats,
            recentActivity: activities
          })
          setNotifications(notifs)
          setUnreadCount(notifs.filter(n => !n.read).length)
        }
      } catch (error) {
        if (isSubscribed) {
          console.error('Error fetching dashboard data:', error)
          toast.error('Failed to load dashboard data')
        }
      } finally {
        if (isSubscribed) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    const unsubscribe = studentApi.notifications.subscribeToRealTime((notification) => {
      if (isSubscribed) {
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        toast.success(notification.message)
      }
    })

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      await studentApi.notifications.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => prev - 1)
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  const quickActions = [
    {
      icon: ClipboardEdit,
      title: "Submit Report",
      description: "Submit your internship reports",
      color: "emerald",
      onClick: () => navigate('/dashboard/submit-report')
    },
    {
      icon: Calendar,
      title: "Register Internship",
      description: "Register for a new internship",
      color: "blue",
      onClick: () => navigate('/dashboard/register-internship')
    },
    {
      icon: Users,
      title: "Edit Profile",
      description: "Update your personal information",
      color: "purple",
      onClick: () => navigate('/dashboard/edit-profile')
    }
  ];

  const stats = [
    {
      title: "Reports Submitted",
      value: dashboardData.reportsSubmitted,
      icon: ClipboardEdit,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Days Remaining",
      value: dashboardData.daysRemaining,
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Overall Progress",
      value: `${dashboardData.overallProgress}%`,
      icon: FileCheck,
      gradient: "from-purple-500 to-purple-600",
      showProgress: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-emerald-600" />
                  <span className="hidden text-xl font-bold text-gray-900 sm:inline-block">IMS</span>
                </Link>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600"
                  as={Link}
                  to="/dashboard"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  as={Link}
                  to="/reports"
                >
                  Reports
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  as={Link}
                  to="/evaluations"
                >
                  Evaluations
                </Button>
              </nav>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <HeaderButton icon={Bell} />
              <ProfileCircle user={user} />
              <HeaderButton
                icon={Menu}
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-white border-b px-4 py-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              as={Link}
              to="/dashboard"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              as={Link}
              to="/reports"
            >
              Reports
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              as={Link}
              to="/evaluations"
            >
              Evaluations
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Student</h1>
          <p className="mt-1 text-sm text-gray-500">Here's an overview of your internship progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardEdit className="h-5 w-5 mr-2 text-emerald-500" />
            Quick Actions
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Evaluations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-emerald-500" />
            Evaluations
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ViewMentorEvaluation />
            <ViewTeacherEvaluation />
          </div>
        </div>

        {/* Internship Status */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-emerald-500" />
            Internship Status
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ViewInternshipDuration />
            <PreliminaryReportCheck />
          </div>
        </div>

        {/* Recent Activity */}
        {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-emerald-500" />
              Recent Activity
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
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
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Notification Panel */}
        {notifications.length > 0 && (
          <div className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <div className="space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-2 rounded ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                  onClick={() => handleMarkNotificationAsRead(notification.id)}
                >
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard