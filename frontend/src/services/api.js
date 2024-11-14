import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token if needed
        const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/);
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken[1];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/api/token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem('access_token', access);
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth endpoints
export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login/', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data);
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/users/register/', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

// User endpoints
export const getCurrentUser = async () => {
    const response = await api.get('/users/me/');
    return response.data;
};

export const updateProfile = async (userData) => {
    const response = await api.patch('/users/me/', userData);
    return response.data;
};

// Dashboard endpoints
export const getDashboardData = async () => {
    try {
        const response = await api.get('/internships/student/dashboard/');
        return response.data;
    } catch (error) {
        console.error('Dashboard error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
};

export default api;