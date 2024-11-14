import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.user_type !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoute; 