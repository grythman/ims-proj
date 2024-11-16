import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API functions
export const login = (credentials) => api.post('/api/users/login/', credentials);
export const register = (userData) => api.post('/api/users/register/', userData);
export const getMe = () => api.get('/api/users/me/');

// Dashboard API functions
export const getDashboardData = () => api.get('/api/dashboard/');
export const getStats = () => api.get('/api/users/stats/');

export default api;