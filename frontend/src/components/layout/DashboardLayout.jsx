import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header className="fixed top-0 w-full z-50" />
            <div className="pt-16">
                <div className="flex">
                    <div 
                        className={`fixed left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                            isSidebarOpen ? 'w-64' : 'w-16'
                        }`}
                    >
                        <div className="h-full overflow-y-auto relative">
                            <Sidebar isCollapsed={!isSidebarOpen} />
                            
                            <button
                                onClick={toggleSidebar}
                                className="absolute top-2 -right-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                                {isSidebarOpen ? (
                                    <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
                                ) : (
                                    <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>
                    <main 
                        className={`transition-all duration-300 ease-in-out ${
                            isSidebarOpen ? 'ml-64' : 'ml-16'
                        } flex-1 p-8`}
                    >
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout; 