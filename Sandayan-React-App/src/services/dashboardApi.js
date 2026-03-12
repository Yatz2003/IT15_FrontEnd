import { api, withRetry } from './api';

export const dashboardApi = {
  getEnrollmentTrends: async () => {
    const response = await withRetry(() => api.get('/api/students/enrollment-trends'));
    return response.data;
  },

  getCourseDistribution: async () => {
    const response = await withRetry(() => api.get('/api/courses/distribution'));
    return response.data;
  },

  getAttendanceData: async () => {
    const response = await withRetry(() => api.get('/api/attendance'));
    return response.data;
  },
};

export default dashboardApi;
