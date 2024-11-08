import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies/');
            setCompanies(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Companies</h1>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add New Company
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company) => (
                    <div key={company.id} className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                        <p className="text-gray-600 mb-4">{company.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                {company.location}
                            </span>
                            <button className="text-blue-500 hover:text-blue-700">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyList; 