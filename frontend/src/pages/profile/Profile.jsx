import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    AcademicCapIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        skills: user?.skills || []
    });
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const response = await api.get('/users/me/stats/');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching user stats:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsChange = (e) => {
        const skills = e.target.value.split(',').map(skill => skill.trim());
        setFormData(prev => ({
            ...prev,
            skills
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.put('/users/me/', formData);
            updateUser(response.data);
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="h-20 w-20 rounded-full object-cover"
                                />
                            ) : (
                                <UserIcon className="h-12 w-12 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user?.full_name || user?.username}
                            </h1>
                            <p className="text-gray-500">{user?.user_type_display}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        {isEditing ? (
                            <>
                                <XMarkIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <PencilIcon className="h-5 w-5 mr-2 text-gray-500" />
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white shadow rounded-lg">
                {error && <ErrorMessage message={error} />}
                {success && <SuccessMessage message={success} />}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Skills (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.skills.join(', ')}
                                onChange={handleSkillsChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                                <dl className="mt-4 space-y-4">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <dt className="text-sm font-medium text-gray-500 mr-2">Email:</dt>
                                        <dd className="text-sm text-gray-900">{user?.email}</dd>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <dt className="text-sm font-medium text-gray-500 mr-2">Phone:</dt>
                                        <dd className="text-sm text-gray-900">{user?.phone || 'Not provided'}</dd>
                                    </div>
                                </dl>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Organization Details</h3>
                                <dl className="mt-4 space-y-4">
                                    <div className="flex items-center">
                                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <dt className="text-sm font-medium text-gray-500 mr-2">Organization:</dt>
                                        <dd className="text-sm text-gray-900">{user?.organization_name || 'Not assigned'}</dd>
                                    </div>
                                    <div className="flex items-center">
                                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <dt className="text-sm font-medium text-gray-500 mr-2">Department:</dt>
                                        <dd className="text-sm text-gray-900">{user?.department_name || 'Not assigned'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {stats && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
                                <dl className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                    {Object.entries(stats).map(([key, value]) => (
                                        <div key={key} className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                                {value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}

                        {user?.bio && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                                <p className="mt-2 text-gray-600">{user.bio}</p>
                            </div>
                        )}

                        {user?.skills?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 