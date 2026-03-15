import { api, apiPath, withRetry } from './api';

const SCHOOL_DAYS_ENDPOINT = apiPath('/school-days');

const normalizeAttendance = (value) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return null;
  }

  if (numeric > 0 && numeric <= 1) {
    return Math.round(numeric * 10000) / 100;
  }

  return Math.round(numeric * 100) / 100;
};

const normalizeIsHoliday = (entry = {}) => {
  const raw = entry.is_holiday ?? entry.holiday ?? entry.isHoliday ?? entry.holiday_status ?? entry.status;

  if (typeof raw === 'boolean') {
    return raw;
  }

  const normalized = String(raw || '').trim().toLowerCase();
  return ['holiday', '1', 'true', 'yes', 'y'].includes(normalized);
};

const normalizeDate = (entry = {}, index = 0) => {
  const rawDate = entry.date || entry.school_date || entry.day_date || entry.day || entry.created_at || '';
  const parsed = Date.parse(String(rawDate).trim());

  if (!Number.isNaN(parsed)) {
    return new Date(parsed);
  }

  const fallback = new Date();
  fallback.setHours(12, 0, 0, 0);
  fallback.setDate(fallback.getDate() + index);
  return fallback;
};

const normalizeEventName = (entry = {}, isHoliday = false) => {
  const rawEvent = entry.event_name || entry.event || entry.activity || entry.name || entry.title || '';
  const eventName = String(rawEvent).trim();

  if (eventName) {
    return eventName;
  }

  return isHoliday ? 'University Holiday' : 'Regular Classes';
};

const normalizeSchoolDays = (rows = []) => rows.map((entry, index) => {
  const date = normalizeDate(entry, index);
  const isHoliday = normalizeIsHoliday(entry);
  const attendanceRate = normalizeAttendance(
    entry.attendance_rate
    ?? entry.attendance
    ?? entry.rate
    ?? entry.attendance_percentage
    ?? entry.value
  );

  return {
    id: entry.id || `${date.toISOString()}-${index}`,
    dateISO: date.toISOString(),
    dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    dayName: String(entry.day_name || entry.day || '').trim() || date.toLocaleDateString('en-US', { weekday: 'long' }),
    eventName: normalizeEventName(entry, isHoliday),
    isHoliday,
    attendanceRate: isHoliday ? null : (attendanceRate ?? 0),
  };
});

const mapSchoolDayError = (error) => {
  if (!error.response) {
    return new Error('Network error while fetching school days. Ensure the Laravel API is running.');
  }

  if (error.response?.status === 404) {
    return new Error('School days endpoint is unavailable at /api/school-days.');
  }

  if (error.response?.status >= 500) {
    return new Error('School days service is temporarily unavailable.');
  }

  return new Error(error.response?.data?.message || error.message || 'Unable to fetch school days.');
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

  if (Array.isArray(payload?.school_days)) {
    return payload.school_days;
  }

  return [];
};

const schoolDayApi = {
  async getSchoolDays() {
    try {
      const response = await withRetry(() => api.get(SCHOOL_DAYS_ENDPOINT), 2);
      const rows = extractRows(response.data);
      return normalizeSchoolDays(rows);
    } catch (error) {
      throw mapSchoolDayError(error);
    }
  },
};

export default schoolDayApi;
