import axios from 'axios';

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/+$/, '');
const TOKEN_STORAGE_KEY = 'authToken';
const API_PREFIX = API_BASE_URL.endsWith('/api') ? '' : '/api';

const isBrowser = typeof window !== 'undefined';
const AUTH_EXPIRED_EVENT = 'auth:expired';


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

      if (isBrowser) {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
      }
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

const extractArrayPayload = (payload) => {
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

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const resolveMonthIndex = (entry = {}) => {
  const rawMonth = String(entry.month || entry.month_name || entry.monthLabel || '').trim();

  if (rawMonth) {
    const numeric = Number(rawMonth);
    if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 12) {
      return numeric - 1;
    }

    const abbreviated = rawMonth.slice(0, 3).toLowerCase();
    const found = MONTH_LABELS.findIndex((label) => label.toLowerCase() === abbreviated);
    if (found >= 0) {
      return found;
    }
  }

  const dateValue = entry.enrollment_date || entry.enrolled_at || entry.created_at || entry.date || null;
  const parsed = Date.parse(String(dateValue || '').trim());
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).getMonth();
  }

  return -1;
};

const normalizeEnrollmentRows = (rows = []) => {
  const monthly = MONTH_LABELS.map((month) => ({ month, total: 0 }));

  rows.forEach((entry) => {
    const monthIndex = resolveMonthIndex(entry);

    if (monthIndex < 0 || monthIndex > 11) {
      return;
    }

    const raw = Number(entry.total ?? entry.count ?? entry.enrollment ?? entry.students ?? entry.value ?? 1);
    const total = Number.isFinite(raw) ? raw : 0;
    monthly[monthIndex].total += total > 0 ? total : 0;
  });

  return monthly;
};

const normalizeDistributionRows = (rows = []) => rows
  .map((entry, index) => ({
    id: entry.id || index + 1,
    program: entry.program || entry.course || entry.course_name || entry.name || `Course ${index + 1}`,
    students: Number(entry.students ?? entry.student_count ?? entry.students_count ?? entry.enrolled_students ?? entry.value ?? entry.total ?? 0),
  }))
  .filter((entry) => Number.isFinite(entry.students) && entry.students >= 0);

const dayLabelFromEntry = (entry = {}) => {
  const explicit = String(entry.day || entry.school_day || entry.label || '').trim();
  if (explicit) {
    return explicit;
  }

  const dateValue = entry.date || entry.day_date || entry.school_date || entry.recorded_at || '';
  const parsed = Date.parse(String(dateValue).trim());
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toLocaleDateString('en-US', { weekday: 'short' });
  }

  return 'N/A';
};

const normalizeAttendanceRows = (rows = []) => rows
  .map((entry) => {
    const present = Number(entry.present ?? entry.attended ?? entry.students_present ?? NaN);
    const total = Number(entry.total_students ?? entry.total ?? entry.students ?? entry.enrolled ?? NaN);
    const baseRate = Number(entry.attendance ?? entry.attendance_rate ?? entry.rate ?? entry.value ?? NaN);

    let attendance = Number.isFinite(baseRate) ? baseRate : 0;
    if (!Number.isFinite(baseRate) && Number.isFinite(present) && Number.isFinite(total) && total > 0) {
      attendance = (present / total) * 100;
    }

    if (attendance > 0 && attendance <= 1) {
      attendance *= 100;
    }

    return {
      day: dayLabelFromEntry(entry),
      attendance: Math.round((Number.isFinite(attendance) ? attendance : 0) * 100) / 100,
    };
  })
  .filter((entry) => Number.isFinite(entry.attendance));

const fetchFromEndpoints = async (paths = []) => {
  let lastError = null;

  for (const path of paths) {
    try {
      const response = await withRetry(() => api.get(apiPath(path)), 1);
      return response.data;
    } catch (error) {
      lastError = error;

      // Stop immediately on auth/permission failures.
      if ([401, 403].includes(error?.response?.status)) {
        throw error;
      }

      // Try the next candidate on not found/unprocessable route shapes.
      if ([404, 405, 422].includes(error?.response?.status)) {
        continue;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('No API endpoints were provided.');
};

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
    const analyticsPayload = await fetchFromEndpoints([
      '/dashboard/enrollment-analytics',
      '/enrollments/monthly-trends',
      '/students-enrolled',
      '/students',
    ]);

    const rows = extractArrayPayload(analyticsPayload);
    return normalizeEnrollmentRows(rows);
  },

  async getProgramDistribution() {
    const distributionPayload = await fetchFromEndpoints([
      '/dashboard/program-distribution',
      '/courses-offered',
      '/courses',
      '/students',
    ]);

    const rows = extractArrayPayload(distributionPayload);
    const normalized = normalizeDistributionRows(rows);

    // If the endpoint returned student rows, aggregate by program/course name.
    const grouped = normalized.reduce((acc, entry) => {
      const key = String(entry.program || '').trim() || 'Unassigned';
      const prev = acc.get(key) || 0;
      const value = Number.isFinite(entry.students) && entry.students > 0 ? entry.students : 1;
      acc.set(key, prev + value);
      return acc;
    }, new Map());

    return Array.from(grouped.entries()).map(([program, students]) => ({ program, students }));
  },

  async getAttendancePatterns() {
    const attendancePayload = await fetchFromEndpoints([
      '/dashboard/attendance-patterns',
      '/school-days',
      '/school_days',
      '/attendance',
    ]);

    const rows = extractArrayPayload(attendancePayload);
    return normalizeAttendanceRows(rows);
  },
};
