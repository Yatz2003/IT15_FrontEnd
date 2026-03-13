import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const TOKEN_STORAGE_KEY = 'authToken';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    return Promise.reject(error);
  }
);

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const isRetryableStatus = (status) => [429, 500, 502, 503, 504].includes(status);

export async function withRetry(requestFn, maxRetries = 2, baseDelay = 500) {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      const status = error.response?.status;
      const canRetry = !status || isRetryableStatus(status);

      if (!canRetry || attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * (attempt + 1);
      await sleep(delay);
      attempt += 1;
    }
  }

  throw new Error('Request failed after retries');
}

export const authApi = {
  async login(email, password) {
    const response = await withRetry(() => api.post('/api/login', { email, password }), 1);
    return response.data;
  },

  async getProfile() {
    const response = await withRetry(() => api.get('/api/profile'), 1);
    return response.data;
  },

  async logout() {
    try {
      await api.post('/api/logout');
    } catch (error) {
      // The UI should still clear local auth state even if this request fails.
      console.error('Logout request failed:', error);
    }
  },
};

export const dashboardApi = {
  async getEnrollmentTrends() {
    const response = await withRetry(() => api.get('/api/students/enrollment-trends'));
    return response.data;
  },

  async getCourseDistribution() {
    const response = await withRetry(() => api.get('/api/courses/distribution'));
    return response.data;
  },

  async getAttendanceData() {
    const response = await withRetry(() => api.get('/api/attendance'));
    return response.data;
  },
};
