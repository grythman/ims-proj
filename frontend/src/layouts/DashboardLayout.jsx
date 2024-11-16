import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  FileText,
  Users,
  Briefcase,
  Calendar,
  Home
} from 'lucide-react';
import { Button } from '../components/UI/Button';

// Navigation configurations for different roles
const navigationConfig = {
  student: [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
    { name: 'Internship', icon: Briefcase, path: '/dashboard/internship' },
    { name: 'Evaluations', icon: Users, path: '/dashboard/evaluations' },
  ],
  mentor: [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Students', icon: Users, path: '/dashboard/students' },
    { name: 'Evaluations', icon: FileText, path: '/dashboard/evaluations' },
    { name: 'Schedule', icon: Calendar, path: '/dashboard/schedule' },
  ],
  teacher: [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Students', icon: Users, path: '/dashboard/students' },
    { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
    { name: 'Evaluations', icon: FileText, path: '/dashboard/evaluations' },
  ],
  admin: [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Users', icon: Users, path: '/dashboard/users' },
    { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ],
};

// Profile Menu Component
const ProfileMenu = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initials = user?.first_name && user?.last_name 
    ? `${user.first_name[0]}${user.last_name[0]}`
    : user?.username?.[0] || '?';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-emerald-600">
              {initials.toUpperCase()}
            </span>
          )}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user?.first_name} {user?.last_name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile Settings
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const role = user?.role || 'student';
  const navigation = navigationConfig[role] || navigationConfig.student;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-emerald-600" />
                <span className="hidden text-xl font-bold text-gray-900 sm:inline-block">
                  IMS
                </span>
              </Link>
              <nav className="hidden md:ml-8 md:flex md:space-x-4">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    as={Link}
                    to={item.path}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <ProfileMenu user={user} logout={logout} />
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                as={Link}
                to={item.path}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 