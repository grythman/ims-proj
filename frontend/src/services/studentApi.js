import api from './api';

const studentApi = {
    dashboard: {
        // Dashboard Overview
        getOverview: async () => {
            try {
                const response = await api.get('/api/dashboard/student/');
                return response.data;
            } catch (error) {
                console.error('Error fetching student dashboard:', error);
                throw error;
            }
        },

        // Dashboard Stats
        getStats: async () => {
            try {
                const response = await api.get('/api/users/stats/');
                return response.data;
            } catch (error) {
                console.error('Error fetching student stats:', error);
                throw error;
            }
        },

        // Recent Activities
        getActivities: async () => {
            try {
                const response = await api.get('/api/dashboard/student/activities/');
                return response.data?.data || [];
            } catch (error) {
                console.error('Error fetching recent activities:', error);
                return [];  // Return empty array on error
            }
        }
    },

    internship: {
        // Get Active Internship
        getCurrent: async () => {
            try {
                const response = await api.get('/api/internships/current/');
                return response.data;
            } catch (error) {
                console.error('Error fetching active internship:', error);
                throw error;
            }
        }
    },

    reports: {
        // Get Reports
        getAll: async () => {
            try {
                const response = await api.get('/api/reports/');
                return response.data;
            } catch (error) {
                console.error('Error fetching reports:', error);
                throw error;
            }
        },

        // Submit Report
        submit: async (data) => {
            try {
                const response = await api.post('/api/reports/submit/', data);
                return response.data;
            } catch (error) {
                console.error('Error submitting report:', error);
                throw error;
            }
        }
    }
};

export default studentApi;
  