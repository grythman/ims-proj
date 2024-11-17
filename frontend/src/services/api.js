import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const login = async (username, password) => {
    try {
        const response = await api.post('/api/users/login/', {
            username: username,
            password: password
        });
        
        if (response.data?.data?.access_token) {
            localStorage.setItem('token', response.data.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        
        return response.data;
    } catch (error) {
        console.error('Login API error:', error.response?.data || error.message);
        throw error;
    }
};

// Define and export the getMe function
export const getMe = async () => {
    const response = await api.get('/api/users/me/');
    return response.data;
};

// Define and export the register function
export const register = async (userData) => {
    const response = await api.post('/api/users/register/', userData);
    return response.data;
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/api/users/password-reset/', { email });
        return response.data;
    } catch (error) {
        console.error('Password reset error:', error.response?.data || error.message);
        throw error;
    }
};

export const resetPassword = async (token, password) => {
    try {
        const response = await api.post('/api/users/password-reset/confirm/', {
            token,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Password reset confirm error:', error.response?.data || error.message);
        throw error;
    }
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;