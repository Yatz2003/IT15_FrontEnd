import { api, apiPath, withRetry } from './api';

const ENROLLMENTS_ENDPOINT = apiPath('/enrollments');

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

  if (Array.isArray(payload?.enrollments)) {
    return payload.enrollments;
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

const normalizeRows = (rows = []) => rows.map((entry, index) => ({
  id: entry.id || entry.enrollment_id || index + 1,
  student: String(
    entry.student_name
    || entry.student
    || entry.name
    || `${entry.first_name || ''} ${entry.last_name || ''}`.trim()
    || 'Unknown Student'
  ),
  subject: String(entry.subject_name || entry.subject || entry.course_subject || 'Unassigned Subject'),
  program: String(entry.program || entry.program_code || entry.course || 'N/A'),
  academicYear: String(entry.academic_year || entry.school_year || entry.year || 'N/A'),
  semester: normalizeSemester(entry.semester || entry.term || entry.sem),
  status: String(entry.status || entry.enrollment_status || 'Active'),
}));

const mapEnrollmentError = (error) => {
  if (!error.response) {
    return new Error('Network error while fetching enrollments. Ensure the Laravel API is running.');
  }

  if (error.response?.status === 404) {
    return new Error('Enrollments endpoint is unavailable at /api/enrollments.');
  }

  if (error.response?.status >= 500) {
    return new Error('Enrollment service is temporarily unavailable.');
  }

  return new Error(error.response?.data?.message || error.message || 'Unable to fetch enrollments.');
};

const enrollmentApi = {
  async getEnrollments() {
    try {
      const response = await withRetry(() => api.get(ENROLLMENTS_ENDPOINT), 2);
      return normalizeRows(extractRows(response.data));
    } catch (error) {
      throw mapEnrollmentError(error);
    }
  },
};

export default enrollmentApi;
