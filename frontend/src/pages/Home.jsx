import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AcademicCapIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    ArrowRightIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/UI/Button';

const Home = () => {
    const { user } = useAuth();

    const features = [
        {
            title: "Internship Management",
            description: "Track and manage internships efficiently with real-time updates.",
            icon: AcademicCapIcon,
            color: "bg-emerald-100 text-emerald-600"
        },
        {
            title: "Mentor Collaboration",
            description: "Connect with industry mentors for guidance and feedback.",
            icon: UserGroupIcon,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Progress Tracking",
            description: "Monitor your internship progress and achievements.",
            icon: ChartBarIcon,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Report Management",
            description: "Submit and track internship reports easily.",
            icon: ClipboardDocumentCheckIcon,
            color: "bg-pink-100 text-pink-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <AcademicCapIcon className="h-8 w-8 text-emerald-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">IMS</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Button
                                    as={Link}
                                    to="/dashboard"
                                    variant="primary"
                                >
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        as={Link}
                                        to="/login"
                                        variant="ghost"
                                    >
                                        Sign in
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/register"
                                        variant="primary"
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-16 pb-32 overflow-hidden">
                <div className="relative">
                    <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                        <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                            <div>
                                <div>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                        Internship Management System
                                    </h1>
                                    <p className="mt-6 text-xl text-gray-500">
                                        Streamline your internship experience with our comprehensive management system.
                                        Track progress, submit reports, and collaborate with mentors efficiently.
                                    </p>
                                </div>
                                <div className="mt-8 flex space-x-4">
                                    <Button
                                        as={Link}
                                        to="/register"
                                        variant="primary"
                                        size="lg"
                                        icon={ArrowRightIcon}
                                    >
                                        Get Started
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/login"
                                        variant="outline"
                                        size="lg"
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Everything You Need
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            A complete solution for managing your internship journey
                        </p>
                    </div>

                    <div className="mt-20">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div key={index} className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div>
                                        <div className={`${feature.color} rounded-lg p-3 inline-flex`}>
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;