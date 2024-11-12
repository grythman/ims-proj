import React from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';

const Navbar = () => {
    const { userType, getRoleBasedRoute } = useRole();

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to={getRoleBasedRoute()} className="text-xl font-bold text-gray-800">
                                IMS
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                            {userType?.charAt(0).toUpperCase() + userType?.slice(1)}
                        </span>
                        <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 