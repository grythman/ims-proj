import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    BellIcon, 
    UserCircleIcon,
    Cog6ToothIcon,
    UserIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Header = ({ theme }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const getRoleLabel = (role) => {
        switch (role) {
            case 'teacher': return 'Teacher';
            case 'mentor': return 'Mentor';
            case 'student': return 'Student';
            default: return 'User';
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className={`bg-gradient-to-r ${theme.headerGradient} shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/dashboard">
                                <img
                                    className="h-8 w-8"
                                    src="/logo.png"
                                    alt="IMS Logo"
                                />
                            </Link>
                        </div>
                        <div className="hidden md:block ml-4">
                            <h1 className="text-xl font-bold text-white">
                                Internship Management System
                            </h1>
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="p-2 rounded-full hover:bg-white/10 relative">
                            <BellIcon className="h-6 w-6 text-white" />
                            {user?.notifications_count > 0 && (
                                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                                    {user.notifications_count}
                                </span>
                            )}
                        </button>

                        {/* User Menu */}
                        <div className="relative ml-3">
                            <div>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 p-2 rounded-full hover:bg-white/10 focus:outline-none"
                                >
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-medium text-white">
                                            {user?.username}
                                        </div>
                                        <div className="text-xs text-white/80">
                                            {getRoleLabel(user?.user_type)}
                                        </div>
                                    </div>
                                    <UserCircleIcon className="h-8 w-8 text-white" />
                                </button>
                            </div>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1" role="menu">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                            role="menuitem"
                                        >
                                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 