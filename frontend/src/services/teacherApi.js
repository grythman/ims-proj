import api from './api';

const ENDPOINTS = {
  DASHBOARD: '/api/dashboard/teacher',
  REPORTS: '/api/reports/teacher',
  EVALUATIONS: '/api/evaluations/teacher',
  STUDENTS: '/api/students/teacher',
};

// Dashboard and analytics
export const dashboardService = {
  getOverview: () => api.get(ENDPOINTS.DASHBOARD),
  getStats: () => api.get(`${ENDPOINTS.DASHBOARD}/stats`),
};

// Report management
export const reportService = {
  getPendingReports: () => api.get(`${ENDPOINTS.REPORTS}/pending`),
  getReportById: (reportId) => api.get(`${ENDPOINTS.REPORTS}/${reportId}`),
  submitEvaluation: (reportId, evaluationData) => 
    api.post(`${ENDPOINTS.REPORTS}/${reportId}/evaluate`, evaluationData),
  downloadReport: (reportId) => 
    api.get(`${ENDPOINTS.REPORTS}/${reportId}/download`, { responseType: 'blob' }),
};

// Student management
export const studentService = {
  getAllStudents: () => api.get(ENDPOINTS.STUDENTS),
  getStudentDetails: (studentId) => api.get(`${ENDPOINTS.STUDENTS}/${studentId}`),
  getStudentProgress: (studentId) => api.get(`${ENDPOINTS.STUDENTS}/${studentId}/progress`),
};

// Evaluation management
export const evaluationService = {
  submitEvaluation: (studentId, evaluationData) => 
    api.post(`${ENDPOINTS.EVALUATIONS}/${studentId}`, evaluationData),
  getEvaluationHistory: (studentId) => 
    api.get(`${ENDPOINTS.EVALUATIONS}/${studentId}/history`),
  updateEvaluation: (evaluationId, data) => 
    api.put(`${ENDPOINTS.EVALUATIONS}/${evaluationId}`, data),
};

// Error handling wrapper
const withErrorHandling = (apiCall) => async (...args) => {
  try {
    const response = await apiCall(...args);
    return response.data;
  } catch (error) {
    console.error('Teacher API Error:', error);
    throw error.response?.data || error;
  }
};

// Export wrapped services
export default {
  dashboard: Object.keys(dashboardService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(dashboardService[key])
  }), {}),
  reports: Object.keys(reportService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(reportService[key])
  }), {}),
  students: Object.keys(studentService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(studentService[key])
  }), {}),
  evaluations: Object.keys(evaluationService).reduce((acc, key) => ({
    ...acc,
    [key]: withErrorHandling(evaluationService[key])
  }), {}),
}; 