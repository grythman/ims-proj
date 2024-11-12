import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AcademicCapIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
    const { user } = useAuth();

    const features = [
        {
            title: "Internship Management",
            description: "Track and manage internships efficiently with real-time updates and progress monitoring.",
            icon: <AcademicCapIcon className="h-8 w-8" />,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Mentor Collaboration",
            description: "Connect students with industry mentors for guidance and professional development.",
            icon: <UserGroupIcon className="h-8 w-8" />,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Progress Tracking",
            description: "Monitor student progress with detailed reports and evaluations.",
            icon: <ClipboardDocumentCheckIcon className="h-8 w-8" />,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Real-time Analytics",
            description: "Get insights with comprehensive analytics and performance metrics.",
            icon: <ChartBarIcon className="h-8 w-8" />,
            color: "bg-orange-100 text-orange-600"
        }
    ];

    const stats = [
        { label: "Active Internships", value: "500+" },
        { label: "Partner Companies", value: "100+" },
        { label: "Success Rate", value: "95%" },
        { label: "Student Satisfaction", value: "4.8/5" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <img
                                className="h-8 w-auto"
                                src="/logo.png"
                                alt="IMS Logo"
                            />
                            <span className="ml-2 text-xl font-bold text-gray-900">IMS</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-gray-900"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
                            <div className="text-center">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block">Streamline Your</span>
                                    <span className="block text-blue-600">Internship Program</span>
                                </h1>
                                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                    Manage internships efficiently with our comprehensive platform. 
                                    Connect students with mentors, track progress, and ensure success.
                                </p>
                                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                                    <div className="rounded-md shadow">
                                        <Link
                                            to={user ? "/dashboard" : "/register"}
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                        >
                                            {user ? 'Go to Dashboard' : 'Get Started'}
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a
                                            href="#features"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                                        >
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Everything You Need
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                            Comprehensive tools for managing internships effectively
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div>
                                        <div className={`${feature.color} rounded-lg inline-flex p-3`}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-blue-600">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl font-extrabold text-white">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-sm font-medium text-blue-100">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-base text-gray-400">
                            &copy; 2024 IMS. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home; 