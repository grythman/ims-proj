import api from './api';

// API Response types for better TypeScript support
/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {any} data
 */

const ENDPOINTS = {
  PROFILE: '/api/users/me',
  REPORTS: '/api/reports',
  INTERNSHIPS: '/api/internships',
  EVALUATIONS: '/api/evaluations',
  DASHBOARD: '/api/dashboard',
  NOTIFICATIONS: '/api/notifications',
  ACTIVITIES: '/api/users/activities',
};

// Profile management with error handling
export const profileService = {
  getProfile: () => api.get(ENDPOINTS.PROFILE),
  updateProfile: (data) => api.put(ENDPOINTS.PROFILE, data),
  uploadProfilePicture: (imageData) => 
    api.post(`${ENDPOINTS.PROFILE}/picture`, imageData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// Report management with advanced features
export const reportService = {
  submitReport: (data) => api.post(`${ENDPOINTS.REPORTS}/submit`, data),
  getReportStatus: (reportId) => api.get(`${ENDPOINTS.REPORTS}/${reportId}/status`),
  submitPreliminary: (data) => api.post(`${ENDPOINTS.REPORTS}/preliminary`, data),
  getPreliminaryStatus: () => api.get(`${ENDPOINTS.REPORTS}/preliminary/status`),
  getAllReports: (params) => api.get(ENDPOINTS.REPORTS, { params }),
  downloadReport: (reportId) => 
    api.get(`${ENDPOINTS.REPORTS}/${reportId}/download`, { responseType: 'blob' }),
};

// Internship management with validation
export const internshipService = {
  register: (data) => api.post(`${ENDPOINTS.INTERNSHIPS}/register`, data),
  getCurrent: () => api.get(`${ENDPOINTS.INTERNSHIPS}/current`),
  getDuration: () => api.get(`${ENDPOINTS.INTERNSHIPS}/duration`),
  updateDetails: (data) => api.put(`${ENDPOINTS.INTERNSHIPS}/current`, data),
  terminateInternship: (reason) => 
    api.post(`${ENDPOINTS.INTERNSHIPS}/terminate`, { reason }),
};

// Evaluation system
export const evaluationService = {
  getMentorEvaluation: () => api.get(`${ENDPOINTS.EVALUATIONS}/mentor`),
  getTeacherEvaluation: () => api.get(`${ENDPOINTS.EVALUATIONS}/teacher`),
  submitSelfEvaluation: (data) => api.post(`${ENDPOINTS.EVALUATIONS}/self`, data),
  getEvaluationHistory: () => api.get(`${ENDPOINTS.EVALUATIONS}/history`),
};

// Dashboard and analytics
export const dashboardService = {
  getOverview: () => api.get(`${ENDPOINTS.DASHBOARD}/student`),
  getStats: () => api.get(`${ENDPOINTS.DASHBOARD}/stats`),
  getActivities: (params) => api.get(ENDPOINTS.ACTIVITIES, { params }),
  logActivity: (data) => api.post(ENDPOINTS.ACTIVITIES, data),
};

// Notification system with real-time support
export const notificationService = {
  getAll: (params) => api.get(ENDPOINTS.NOTIFICATIONS, { params }),
  markAsRead: (notificationId) => 
    api.put(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`),
  updatePreferences: (preferences) => 
    api.put(`${ENDPOINTS.NOTIFICATIONS}/preferences`, preferences),
  getPreferences: () => api.get(`${ENDPOINTS.NOTIFICATIONS}/preferences`),
  subscribeToRealTime: (callback) => {
    // Implement WebSocket connection here
    console.warn('WebSocket implementation required');
  },
};

// Error handling wrapper
const withErrorHandling = (apiCall) => async (...args) => {
  try {
    const response = await apiCall(...args);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    console.error('API Error:', error);
    throw error.response?.data || error;
  }
};

// Export wrapped services
export default {
  profile: Object.keys(profileService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(profileService[key])
  }), {}),
  reports: Object.keys(reportService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(reportService[key])
  }), {}),
  internships: Object.keys(internshipService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(internshipService[key])
  }), {}),
  evaluations: Object.keys(evaluationService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(evaluationService[key])
  }), {}),
  dashboard: Object.keys(dashboardService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(dashboardService[key])
  }), {}),
  notifications: Object.keys(notificationService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(notificationService[key])
  }), {}),
};
  