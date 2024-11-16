import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (error.response.data.message === 'Token expired') {
        try {
          const response = await api.post('/api/token/refresh/', {
            refresh: localStorage.getItem('refresh_token')
          });
          const { access } = response.data;
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          removeToken();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      removeToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth endpoints - Export these directly
export const login = async (credentials) => {
  try {
    // First, get the JWT tokens
    const tokenResponse = await api.post('/api/token/', {
      username: credentials.username,
      password: credentials.password,
    });
    
    console.log('Token response:', tokenResponse);
    
    const { access, refresh } = tokenResponse.data;
    
    if (!access) {
      throw new Error('No access token received');
    }
    
    // Store refresh token
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    }

    // Get user data using the access token
    const userResponse = await api.get('/api/users/me/', {
      headers: { Authorization: `Bearer ${access}` }
    });
    
    return {
      data: {
        token: access,
        user: userResponse.data
      }
    };
  } catch (error) {
    console.error('Login error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const register = (userData) => api.post('/api/users/register/', userData);
export const logout = () => api.post('/api/users/logout/');
export const getMe = () => api.get('/api/users/me/');
export const refreshToken = () => api.post('/api/token/refresh/', {
  refresh: localStorage.getItem('refresh_token')
});
export const forgotPassword = (email) => api.post('/api/users/forgot-password/', { email });
export const resetPassword = (token, password) => 
  api.post('/api/users/reset-password/', { token, password });

// Also export as part of authService object
export const authService = {
  login,
  register,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
};

export default api;