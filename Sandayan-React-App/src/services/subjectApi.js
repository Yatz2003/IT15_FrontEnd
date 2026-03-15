import { api, apiPath, withRetry } from './api';

const SUBJECTS_ENDPOINT = apiPath('/subjects');

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

  if (Array.isArray(payload?.subjects)) {
    return payload.subjects;
  }

  return [];
};

const normalizeSemester = (value) => {
  const raw = String(value || '').trim();
  if (!raw) {
    return 'N/A';
  }

  const lowered = raw.toLowerCase();
  if (['1', '1st', 'first'].includes(lowered)) {
    return 'First';
  }

  if (['2', '2nd', 'second'].includes(lowered)) {
    return 'Second';
  }

  return raw;
};

const normalizeRows = (rows = []) => rows
  .map((entry, index) => ({
    id: entry.id || entry.subject_id || `${entry.code || entry.subject_code || entry.subjectCode || index + 1}`,
    code: String(entry.code || entry.subject_code || entry.subjectCode || '').trim(),
    name: String(entry.name || entry.subject_name || entry.subject || entry.title || '').trim() || 'Untitled Subject',
    program: String(entry.program || entry.program_code || entry.course || entry.department || '').trim() || 'N/A',
    units: Number.isFinite(Number(entry.units)) ? Number(entry.units) : String(entry.units || 'N/A'),
    semester: normalizeSemester(entry.semester || entry.term || entry.sem || entry.semester_name),
  }))
  .filter((entry) => entry.code);

const dedupeBySubjectCode = (rows = []) => {
  const seen = new Set();

  return rows.filter((entry) => {
    const normalizedCode = String(entry.code || '').trim().toUpperCase();

    if (!normalizedCode || seen.has(normalizedCode)) {
      return false;
    }

    seen.add(normalizedCode);
    return true;
  });
};

const mapSubjectError = (error) => {
  if (!error.response) {
    return new Error('Network error while fetching subjects. Ensure the Laravel API is running.');
  }

  if (error.response?.status === 404) {
    return new Error('Subjects endpoint is unavailable at /api/subjects.');
  }

  if (error.response?.status >= 500) {
    return new Error('Subjects service is temporarily unavailable.');
  }

  return new Error(error.response?.data?.message || error.message || 'Unable to fetch subjects.');
};

const subjectApi = {
  async getSubjects() {
    try {
      const response = await withRetry(() => api.get(SUBJECTS_ENDPOINT), 2);
      const rows = extractRows(response.data);
      return dedupeBySubjectCode(normalizeRows(rows));
    } catch (error) {
      throw mapSubjectError(error);
    }
  },

  async createSubject(payload) {
    try {
      const response = await withRetry(() => api.post(SUBJECTS_ENDPOINT, payload), 1);
      const rows = dedupeBySubjectCode(normalizeRows(extractRows(response.data)));

      if (rows.length) {
        return rows[0];
      }

      return dedupeBySubjectCode(normalizeRows([response.data?.data || response.data || payload]))[0] || null;
    } catch (error) {
      throw mapSubjectError(error);
    }
  },

  async updateSubject(id, payload) {
    try {
      const response = await withRetry(() => api.put(apiPath(`/subjects/${id}`), payload), 1);
      const rows = dedupeBySubjectCode(normalizeRows(extractRows(response.data)));

      if (rows.length) {
        return rows[0];
      }

      return dedupeBySubjectCode(normalizeRows([response.data?.data || response.data || { id, ...payload }]))[0] || null;
    } catch (error) {
      throw mapSubjectError(error);
    }
  },
};

export default subjectApi;
