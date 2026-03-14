import axios from 'axios';

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/+$/, '');
const TOKEN_STORAGE_KEY = 'authToken';
const API_PREFIX = API_BASE_URL.endsWith('/api') ? '' : '/api';

export const apiPath = (path) => {
  const normalized = String(path || '').replace(/^\/+/, '');

  if (!API_PREFIX) {
    return normalized;
  }

  return `${API_PREFIX}/${normalized}`;
};

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
    const response = await withRetry(() => api.post(apiPath('/login'), { email, password }), 1);
    return response.data;
  },

  async getProfile() {
    const response = await withRetry(() => api.get(apiPath('/profile')), 1);
    return response.data;
  },

  async logout() {
    try {
      await api.post(apiPath('/logout'));
    } catch (error) {
      // The UI should still clear local auth state even if this request fails.
      console.error('Logout request failed:', error);
    }
  },
};

export const dashboardApi = {
  async getEnrollmentAnalytics() {
    const response = await withRetry(() => api.get(apiPath('/dashboard/enrollment-analytics')));
    return response.data;
  },

  async getProgramDistribution() {
    const response = await withRetry(() => api.get(apiPath('/dashboard/program-distribution')));
    return response.data;
  },

  async getAttendancePatterns() {
    const response = await withRetry(() => api.get(apiPath('/dashboard/attendance-patterns')));
    return response.data;
  },
};
