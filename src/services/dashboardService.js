import api from './api';

const dashboardService = {
    getReportsSummary: async () => {
        try {
            const response = await api.get('/admin/dashboard/get-reports-summary');
            return response.data || {}; // Assuming response structure { success: true, data: { ... } }
        } catch (error) {
            console.error("Failed to fetch reports summary:", error);
            return null;
        }
    },

    getDealersByMonth: async (year) => {
        try {
            // Default to current year if not provided
            const targetYear = year || new Date().getFullYear();
            const response = await api.get(`/admin/dashboard/get-dealers-by-months?year=${targetYear}`);
            return response.data || {};
        } catch (error) {
            console.error("Failed to fetch dealers by month:", error);
            return null;
        }
    }
};

export default dashboardService;
