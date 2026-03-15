import { api, apiPath, withRetry } from './api';

const ENDPOINTS = {
  enrollmentSummary: apiPath('/reports/enrollment-summary'),
  programDistribution: apiPath('/reports/program-distribution'),
  attendanceSummary: apiPath('/reports/attendance-summary'),
};

const extractRows = (payload = {}) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

const normalizeEnrollmentSummary = (rows = []) => rows.map((entry, index) => ({
  label: String(entry.label || entry.month || entry.term || `Item ${index + 1}`),
  total: Number(entry.total ?? entry.count ?? entry.value ?? 0),
}));

const normalizeProgramDistribution = (rows = []) => rows.map((entry, index) => ({
  name: String(entry.program || entry.name || entry.label || `Program ${index + 1}`),
  value: Number(entry.total ?? entry.students ?? entry.count ?? entry.value ?? 0),
}));

const normalizeAttendanceSummary = (rows = []) => rows.map((entry, index) => ({
  label: String(entry.day || entry.date || entry.label || `Point ${index + 1}`),
  attendance: Number(entry.attendance ?? entry.rate ?? entry.value ?? 0),
}));

const mapReportError = (error) => {
  if (!error.response) {
    return new Error('Network error while fetching reports. Ensure the Laravel API is running.');
  }

  if (error.response?.status >= 500) {
    return new Error('Reports service is temporarily unavailable.');
  }

  return new Error(error.response?.data?.message || error.message || 'Unable to load report data.');
};

const reportsApi = {
  async getEnrollmentSummary() {
    try {
      const response = await withRetry(() => api.get(ENDPOINTS.enrollmentSummary), 2);
      return normalizeEnrollmentSummary(extractRows(response.data));
    } catch (error) {
      throw mapReportError(error);
    }
  },

  async getProgramDistribution() {
    try {
      const response = await withRetry(() => api.get(ENDPOINTS.programDistribution), 2);
      return normalizeProgramDistribution(extractRows(response.data));
    } catch (error) {
      throw mapReportError(error);
    }
  },

  async getAttendanceSummary() {
    try {
      const response = await withRetry(() => api.get(ENDPOINTS.attendanceSummary), 2);
      return normalizeAttendanceSummary(extractRows(response.data));
    } catch (error) {
      throw mapReportError(error);
    }
  },
};

export default reportsApi;
