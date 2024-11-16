import api from './api';

// Profile management
export const getMe = () => api.get('/api/users/me/');
export const updateProfile = (profileData) => api.put('/api/users/me/', profileData);

// Report submission
export const submitReport = (reportData) => 
  api.post('/api/reports/submit/', reportData);

export const getReportStatus = (reportId) => 
  api.get(`/api/reports/${reportId}/status/`);

// Internship registration
export const registerInternship = (internshipData) => 
  api.post('/api/internships/register/', internshipData);

export const getInternshipDetails = () => 
  api.get('/api/internships/current/');

// Evaluations
export const getMentorEvaluation = () => 
  api.get('/api/evaluations/mentor/');

export const getTeacherEvaluation = () => 
  api.get('/api/evaluations/teacher/');

// Preliminary report
export const submitPreliminaryReport = (reportData) => 
  api.post('/api/reports/preliminary/', reportData);

export const getPreliminaryReportStatus = () => 
  api.get('/api/reports/preliminary/status/');

// Internship duration
export const getInternshipDuration = () => 
  api.get('/api/internships/duration/');

// Student dashboard
export const getStudentDashboard = () => 
  api.get('/api/dashboard/student/');

export const getStudentStats = () => 
  api.get('/api/users/stats/student/');

// Student activities
export const getStudentActivities = () => 
  api.get('/api/users/activities/');

export const logActivity = (activityData) => 
  api.post('/api/users/activities/', activityData);

// Student notifications
export const getNotifications = () => 
  api.get('/api/notifications/');

export const markNotificationAsRead = (notificationId) => 
  api.put(`/api/notifications/${notificationId}/read/`);

// Student preferences
export const updateNotificationPreferences = (preferences) => 
  api.put('/api/users/notification-preferences/', preferences);

export const getNotificationPreferences = () => 
  api.get('/api/users/notification-preferences/');
  