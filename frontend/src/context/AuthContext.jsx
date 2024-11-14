import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('isSuperuser');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                
                // Verify token and refresh user data
                const response = await api.get('/users/me/');
                setUser(response.data);
            } else {
                await logout();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (username, password) => {
        try {
            const response = await apiLogin(username, password);

            const { access_token, refresh_token, user: userData } = response;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isStaff', userData.is_staff || false);
            localStorage.setItem('isSuperuser', userData.is_superuser || false);

            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(userData);

            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};