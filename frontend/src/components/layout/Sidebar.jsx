import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    DocumentTextIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    UserGroupIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isCollapsed }) => {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
        { name: 'Reports', icon: DocumentTextIcon, path: '/reports' },
        { name: 'Internships', icon: AcademicCapIcon, path: '/internships' },
        { name: 'Evaluations', icon: ClipboardDocumentCheckIcon, path: '/evaluations' },
        { name: 'Progress', icon: ChartBarIcon, path: '/progress' },
        { name: 'Messages', icon: ChatBubbleLeftRightIcon, path: '/messages' },
        { name: 'Profile', icon: UserGroupIcon, path: '/profile' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="py-6 px-3">
            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`
                            flex items-center px-3 py-2 text-sm font-medium rounded-md
                            ${isActive(item.path)
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title={isCollapsed ? item.name : ''}
                    >
                        <item.icon
                            className={`
                                ${isCollapsed ? 'h-6 w-6' : 'h-6 w-6 mr-3'}
                                ${isActive(item.path)
                                    ? 'text-emerald-500'
                                    : 'text-gray-400 group-hover:text-gray-500'
                                }
                            `}
                        />
                        {!isCollapsed && item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar; 