import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import {
    AcademicCapIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    ArrowRightIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
    const features = [
        {
            title: "Internship Management",
            description: "Track and manage internships efficiently with real-time updates and progress monitoring.",
            icon: <AcademicCapIcon className="h-8 w-8" />,
            color: "bg-emerald-100 text-emerald-600",
            link: "/internships"
        },
        {
            title: "Mentor Collaboration",
            description: "Connect students with industry mentors for guidance and professional development.",
            icon: <UserGroupIcon className="h-8 w-8" />,
            color: "bg-emerald-100 text-emerald-600",
            link: "/mentors"
        },
        {
            title: "Progress Tracking",
            description: "Monitor student progress with detailed reports and evaluations.",
            icon: <ClipboardDocumentCheckIcon className="h-8 w-8" />,
            color: "bg-emerald-100 text-emerald-600",
            link: "/progress"
        },
        {
            title: "Real-time Analytics",
            description: "Get insights with comprehensive analytics and performance metrics.",
            icon: <ChartBarIcon className="h-8 w-8" />,
            color: "bg-emerald-100 text-emerald-600",
            link: "/analytics"
        }
    ];

    const benefits = [
        "Streamlined internship management process",
        "Real-time progress tracking and reporting",
        "Direct communication between mentors and students",
        "Comprehensive analytics and insights",
        "Automated documentation and paperwork",
        "Enhanced student-mentor matching"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
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
                        {/* Navigation Links */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-8">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Add padding to account for fixed navigation */}
            <div className="pt-16">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800">
                    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Internship Management System
                            </h1>
                            <p className="mt-6 text-xl text-emerald-100 max-w-3xl mx-auto">
                                Streamline your internship program with our comprehensive platform. 
                                Connect mentors with students, track progress, and ensure success.
                            </p>
                            <div className="mt-10 flex justify-center gap-4">
                                <Link 
                                    to="/register" 
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50"
                                >
                                    Get Started
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-emerald-700"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900">
                                Why Choose Our Platform?
                            </h2>
                        </div>
                        <div className="mt-10">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-base text-gray-500">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Everything You Need
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                Comprehensive tools and features to make internship management simple and effective
                            </p>
                        </div>

                        <div className="mt-20">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature, index) => (
                                    <Link
                                        key={index}
                                        to={feature.link}
                                        className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 overflow-hidden"
                                    >
                                        <div className={`${feature.color} rounded-lg inline-flex p-3`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-gray-500">
                                            {feature.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            Learn more
                                            <ArrowRightIcon className="ml-1 h-4 w-4" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-base text-gray-400">
                            &copy; {new Date().getFullYear()} Internship Management System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;