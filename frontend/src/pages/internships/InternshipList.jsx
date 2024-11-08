import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const response = await api.get('/internships/');
            setInternships(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching internships:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Internships</h1>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add New Internship
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {internships.map((internship) => (
                        <li key={internship.id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {internship.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {internship.company.name}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        internship.status === 'active' 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {internship.status}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InternshipList; 