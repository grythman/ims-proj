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
export const getStudentDashboardData = async () => {
    try {
        // Log auth info for debugging
        const token = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('Fetching student dashboard data...');
        console.log('User type:', user?.user_type);
        console.log('Token present:', !!token);

        const response = await api.get('/internships/student/dashboard/');
        console.log('Student dashboard response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Student Dashboard error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(error.response?.data?.message || 'Failed to fetch student dashboard data');
    }
};

export const getTeacherDashboardData = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        console.log('Making request to teacher dashboard endpoint...');
        const response = await api.get('/internships/teacher/dashboard/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Teacher dashboard response:', response.data);
        
        if (!response.data || !response.data.stats) {
            throw new Error('Invalid response data structure');
        }

        return response.data;
    } catch (error) {
        console.error('Teacher Dashboard error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        if (error.response?.status === 403) {
            throw new Error('Access forbidden. Please verify your teacher privileges.');
        }
        
        if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in again.');
        }
        
        throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch dashboard data');
    }
};

// Report endpoints
export const submitReport = async (reportData) => {
    try {
        const response = await api.post('/internships/reports/submit/', reportData);
        return response.data;
    } catch (error) {
        console.error('Submit report error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to submit report');
    }
};

export const evaluateReport = async (reportId, evaluationData) => {
    try {
        const response = await api.post(`/internships/reports/${reportId}/evaluate/`, evaluationData);
        return response.data;
    } catch (error) {
        console.error('Evaluation error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to submit evaluation');
    }
};

// Update DashboardContext to handle both student and teacher dashboards
export const getDashboardData = async (userType) => {
    try {
        if (userType === 'teacher') {
            return await getTeacherDashboardData();
        } else if (userType === 'student') {
            return await getStudentDashboardData();
        } else {
            throw new Error('Invalid user type');
        }
    } catch (error) {
        console.error('Dashboard error:', error);
        throw error;
    }
};

export default api;