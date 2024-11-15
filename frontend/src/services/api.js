import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh-token', { refreshToken });
        const { token } = response.data;

        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (error) {
        // Redirect to login if refresh token fails
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Auth services
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerUser = async (userData) => {
  try {
    console.log('Attempting to register user:', userData);
    
    // Validate data before sending
    if (!userData.username || !userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      throw new Error('All fields are required');
    }

    const response = await api.post('/auth/register', {
      username: userData.username.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      role: userData.role,
      ...(userData.role === 'student' && {
        studentId: userData.studentId,
        department: userData.department
      })
    });
    
    console.log('Registration response:', response);
    
    if (response.data.success) {
      // Store token and user data if registration is successful
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      response: error.response,
      request: error.request
    });

    if (error.response?.data) {
      throw new Error(error.response.data.message);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Error setting up the request. Please try again.');
    }
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.clear();
  } catch (error) {
    localStorage.clear();
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User management services
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserRoles = async () => {
  try {
    const response = await api.get('/users/roles');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserPermissions = async () => {
  try {
    const response = await api.get('/users/permissions');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserPermissions = async (userId, permissions) => {
  try {
    const response = await api.put(`/users/${userId}/permissions`, permissions);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Organization services
export const getAllOrganizations = async () => {
  try {
    const response = await api.get('/organizations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createOrganization = async (data) => {
  try {
    const response = await api.post('/organizations', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrganization = async (orgId, data) => {
  try {
    const response = await api.put(`/organizations/${orgId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteOrganization = async (orgId) => {
  try {
    const response = await api.delete(`/organizations/${orgId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// News services
export const getAllNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createNews = async (data) => {
  try {
    const response = await api.post('/news', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateNews = async (newsId, data) => {
  try {
    const response = await api.put(`/news/${newsId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteNews = async (newsId) => {
  try {
    const response = await api.delete(`/news/${newsId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// System settings services
export const getSystemSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateSystemSettings = async (settings) => {
  try {
    const response = await api.put('/settings', settings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getThemes = async () => {
  try {
    const response = await api.get('/settings/themes');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Evaluation services
export const submitFinalEvaluation = async (studentId, evaluationData) => {
  try {
    const response = await api.post(`/evaluations/final/${studentId}`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const signFinalEvaluation = async (evaluationId, signatureData) => {
  try {
    const response = await api.post(`/evaluations/final/${evaluationId}/sign`, signatureData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFinalEvaluationTemplate = async () => {
  try {
    const response = await api.get('/evaluations/final/template');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStudentFinalEvaluationData = async (studentId) => {
  try {
    const response = await api.get(`/evaluations/final/${studentId}/data`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getEvaluationStatistics = async () => {
  try {
    const response = await api.get('/evaluations/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTeacherEvaluations = async () => {
  try {
    const response = await api.get('/evaluations/teacher');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTeacherEvaluationDetails = async (evaluationId) => {
  try {
    const response = await api.get(`/evaluations/teacher/${evaluationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addTeacherComment = async (evaluationId, commentData) => {
  try {
    const response = await api.post(`/evaluations/teacher/${evaluationId}/comment`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMentorEvaluation = async (evaluationId, evaluationData) => {
  try {
    const response = await api.put(`/evaluations/mentor/${evaluationId}`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Student Progress services
export const getStudentProgressDetails = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/progress`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addProgressNote = async (studentId, noteData) => {
  try {
    const response = await api.post(`/students/${studentId}/notes`, noteData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStudentSubmissions = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/submissions`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStudentAllEvaluations = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/evaluations`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStudentsList = async () => {
  try {
    const response = await api.get('/students/list');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mentor Evaluation services
export const getMentorEvaluationDetails = async (evaluationId) => {
  try {
    const response = await api.get(`/evaluations/mentor/${evaluationId}/details`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMentorEvaluationsByTeacher = async () => {
  try {
    const response = await api.get('/evaluations/mentor/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMentorEvaluations = async () => {
  try {
    const response = await api.get('/evaluations/mentor');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Report services
export const downloadReport = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const evaluateReport = async (reportId, evaluationData) => {
  try {
    const response = await api.post(`/reports/${reportId}/evaluate`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getReportDetails = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/details`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSubmittedReports = async () => {
  try {
    const response = await api.get('/reports/submitted');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getReportFeedback = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}/feedback`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Student Profile services
export const getStudentProfile = async () => {
  try {
    const response = await api.get('/profile/student');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateStudentProfile = async (profileData) => {
  try {
    const response = await api.put('/profile/student', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateStudentAvatar = async (formData) => {
  try {
    const response = await api.put('/profile/student/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Preliminary Report services
export const submitPreliminaryReport = async (reportData) => {
  try {
    const response = await api.post('/reports/preliminary', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPreliminaryReportStatus = async (reportId) => {
  try {
    const response = await api.get(`/reports/preliminary/${reportId}/status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPreliminaryReportFeedback = async (reportId) => {
  try {
    const response = await api.get(`/reports/preliminary/${reportId}/feedback`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePreliminaryReport = async (reportId, reportData) => {
  try {
    const response = await api.put(`/reports/preliminary/${reportId}`, reportData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Internship services
export const getInternshipDetails = async () => {
  try {
    const response = await api.get('/internships/details');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerInternship = async (internshipData) => {
  try {
    const response = await api.post('/internships/register', internshipData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getInternshipDuration = async () => {
  try {
    const response = await api.get('/internships/duration');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAvailableCompanies = async () => {
  try {
    const response = await api.get('/companies/available');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Evaluation services
export const getEvaluationDetails = async (evaluationId) => {
  try {
    const response = await api.get(`/evaluations/${evaluationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStudentEvaluations = async () => {
  try {
    const response = await api.get('/evaluations/student');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitEvaluation = async (evaluationData) => {
  try {
    const response = await api.post('/evaluations', evaluationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mentor Report services
export const createMentorReport = async (studentId, reportData) => {
  try {
    const response = await api.post(`/mentor/students/${studentId}/reports`, reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const signMentorReport = async (reportId, signatureData) => {
  try {
    const response = await api.post(`/mentor/reports/${reportId}/sign`, signatureData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMentorReportTemplate = async () => {
  try {
    const response = await api.get('/mentor/reports/template');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMentorReportHistory = async (studentId) => {
  try {
    const response = await api.get(`/mentor/students/${studentId}/reports/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMentorReport = async (reportId, reportData) => {
  try {
    const response = await api.put(`/mentor/reports/${reportId}`, reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPerformanceMetrics = async (studentId) => {
  try {
    const response = await api.get(`/mentor/students/${studentId}/metrics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mentor Advice services
export const getAdviceHistory = async (studentId) => {
  try {
    const response = await api.get(`/mentor/students/${studentId}/advice`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addAdvice = async (studentId, adviceData) => {
  try {
    const response = await api.post(`/mentor/students/${studentId}/advice`, adviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateAdvice = async (adviceId, adviceData) => {
  try {
    const response = await api.put(`/mentor/advice/${adviceId}`, adviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAdviceCategories = async () => {
  try {
    const response = await api.get('/mentor/advice/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAdviceTemplates = async () => {
  try {
    const response = await api.get('/mentor/advice/templates');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Statistics services
export const getStudentStatistics = async (studentId) => {
  try {
    const response = await api.get(`/mentor/students/${studentId}/statistics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPerformanceTrends = async (studentId) => {
  try {
    const response = await api.get(`/mentor/students/${studentId}/trends`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMentorStatistics = async () => {
  try {
    const response = await api.get('/mentor/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getReportStatistics = async () => {
  try {
    const response = await api.get('/mentor/statistics/reports');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getActivityLogs = async (params) => {
  try {
    const response = await api.get('/mentor/statistics/activity', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// System Management services
export const testEmailSettings = async (emailSettings) => {
  try {
    const response = await api.post('/admin/settings/email/test', emailSettings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const backupSystem = async () => {
  try {
    const response = await api.post('/admin/settings/backup');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateEmailSettings = async (emailSettings) => {
  try {
    const response = await api.put('/admin/settings/email', emailSettings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSystemLogs = async (params) => {
  try {
    const response = await api.get('/admin/settings/logs', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const restoreSystem = async (backupData) => {
  try {
    const response = await api.post('/admin/settings/restore', backupData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export the api instance
export default api; 