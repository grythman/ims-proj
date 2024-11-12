import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    UserIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const { user } = useAuth();

    const getNavLinks = () => {
        const commonLinks = [
            { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
            { to: '/profile', label: 'Profile', icon: UserIcon }
        ];

        if (user?.user_type === 'student') {
            return [
                ...commonLinks,
                { 
                    to: '/internships/agreement', 
                    label: 'Agreement', 
                    icon: DocumentDuplicateIcon 
                },
                { 
                    to: '/internships/plan', 
                    label: 'Internship Plan', 
                    icon: ClipboardDocumentListIcon 
                },
                { 
                    to: '/reports', 
                    label: 'Reports', 
                    icon: DocumentTextIcon 
                }
            ];
        }

        if (user?.user_type === 'mentor' || user?.user_type === 'teacher') {
            return [
                ...commonLinks,
                { 
                    to: '/internships', 
                    label: 'Internships', 
                    icon: AcademicCapIcon 
                },
                { 
                    to: '/reports', 
                    label: 'Reports', 
                    icon: DocumentTextIcon 
                },
                { 
                    to: '/settings', 
                    label: 'Settings', 
                    icon: Cog6ToothIcon 
                }
            ];
        }

        return commonLinks;
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 px-4">
                    <img
                        className="h-8 w-auto"
                        src="/logo.png"
                        alt="Logo"
                    />
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {getNavLinks().map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon
                                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                                            isActive
                                                ? 'text-gray-500'
                                                : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                    {link.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            {user?.username}
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                            {user?.user_type}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 