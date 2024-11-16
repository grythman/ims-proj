import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/auth';
import { login as loginApi, getMe } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await getMe();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      removeToken();
      setUser(null);
      return null;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          await fetchUserData();
        } catch (error) {
          console.error('Auth initialization failed:', error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      console.log('Login response:', response);

      const { token, user: userData } = response.data;
      
      if (!token) {
        throw new Error('No token received');
      }

      // Store the token
      setToken(token);

      // Set user data if it was returned with login, otherwise fetch it
      if (userData) {
        setUser(userData);
      } else {
        await fetchUserData();
      }

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    // Optionally redirect to login page
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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

export default AuthContext;