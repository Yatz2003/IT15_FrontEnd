import { useEffect, useMemo, useState } from 'react';
import EnrollmentChart from './EnrollmentChart';
import CourseDistributionChart from './CourseDistributionChart';
import AttendanceChart from './AttendanceChart';
import SchoolDaysSection from './SchoolDaysSection';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { dashboardApi } from '../../services/api';
import schoolDayApi from '../../services/schoolDayApi';
import subjectApi from '../../services/subjectApi';
import WeatherWidget from '../weather/WeatherWidget';
import weatherApi from '../../services/weatherApi';

const extractError = (error, fallback) => {
  const status = error?.response?.status;

  if (status === 401) {
    return 'Session expired. Please sign in again.';
  }

  return error.response?.data?.message || error.message || fallback;
};

const normalizeAttendanceValue = (entry = {}) => {
  const raw = Number(entry.attendance ?? entry.rate ?? entry.value ?? 0);

  if (!Number.isFinite(raw)) {
    return 0;
  }

  // Some APIs return ratios (0.87) instead of percentages (87).
  if (raw > 0 && raw <= 1) {
    return raw * 100;
  }

  return raw;
};

const metricCards = [
  { key: 'studentsCount', title: 'Total Students', hint: 'Total enrolled learners' },
  { key: 'totalPrograms', title: 'Total Programs', hint: 'Registered curriculum tracks' },
  { key: 'totalSubjects', title: 'Total Subjects', hint: 'Available learning units' },
  { key: 'activePrograms', title: 'Active Programs', hint: 'Programs currently running' },
  { key: 'averageAttendance', title: 'Average Attendance', hint: 'Overall attendance rate' },
];

const BRAND_LOGO_SRC = '/brand/SandayanAcademy.png';
const SCHOOL_DAYS_FALLBACK = [
  {
    id: 'fallback-1',
    dateISO: '2026-03-10T00:00:00.000Z',
    dateLabel: 'Mar 10',
    dayName: 'Monday',
    eventName: 'Regular Classes',
    attendanceRate: 92,
    isHoliday: false,
  },
  {
    id: 'fallback-2',
    dateISO: '2026-03-11T00:00:00.000Z',
    dateLabel: 'Mar 11',
    dayName: 'Tuesday',
    eventName: 'Midterm Exams',
    attendanceRate: 88,
    isHoliday: false,
  },
  {
    id: 'fallback-3',
    dateISO: '2026-03-12T00:00:00.000Z',
    dateLabel: 'Mar 12',
    dayName: 'Wednesday',
    eventName: 'University Holiday',
    attendanceRate: null,
    isHoliday: true,
  },
  {
    id: 'fallback-4',
    dateISO: '2026-03-13T00:00:00.000Z',
    dateLabel: 'Mar 13',
    dayName: 'Thursday',
    eventName: 'Research Symposium',
    attendanceRate: 90,
    isHoliday: false,
  },
  {
    id: 'fallback-5',
    dateISO: '2026-03-14T00:00:00.000Z',
    dateLabel: 'Mar 14',
    dayName: 'Friday',
    eventName: 'Sports Festival',
    attendanceRate: 85,
    isHoliday: false,
  },
  {
    id: 'fallback-6',
    dateISO: '2026-03-15T00:00:00.000Z',
    dateLabel: 'Mar 15',
    dayName: 'Saturday',
    eventName: 'Final Exams',
    attendanceRate: 87,
    isHoliday: false,
  },
  {
    id: 'fallback-7',
    dateISO: '2026-03-16T00:00:00.000Z',
    dateLabel: 'Mar 16',
    dayName: 'Sunday',
    eventName: 'Graduation Day',
    attendanceRate: 93,
    isHoliday: false,
  },
];

const parseCapacity = (entry = {}) => {
  const present = Number(entry.students_present ?? entry.present ?? entry.current_students ?? entry.enrolled ?? NaN);
  const max = Number(entry.max_capacity ?? entry.capacity ?? entry.room_capacity ?? entry.maximum ?? NaN);

  if (Number.isFinite(present) && Number.isFinite(max) && max > 0) {
    return `${present}/${max}`;
  }

  if (typeof entry.student_capacity === 'string' && entry.student_capacity.trim()) {
    return entry.student_capacity.trim();
  }

  if (typeof entry.capacity_text === 'string' && entry.capacity_text.trim()) {
    return entry.capacity_text.trim();
  }

  const fallbackCurrent = Number(entry.available_slots ?? entry.slots ?? NaN);
  if (Number.isFinite(fallbackCurrent)) {
    return `${Math.max(0, fallbackCurrent)}/45`;
  }

  return '30/45';
};

const isGenericSubjectLabel = (value = '') => /^subject\s*\d*$/i.test(String(value).trim());

const buildRoomAssignments = (distribution = [], subjects = []) => {
  const subjectByCode = new Map(
    subjects
      .map((subject) => [String(subject.code || '').trim().toUpperCase(), String(subject.name || '').trim()])
      .filter(([code, name]) => code && name)
  );
  const backendSubjectNames = subjects.map((subject) => String(subject.name || '').trim()).filter(Boolean);

  const rows = distribution.slice(0, 8).map((entry, index) => {
    const code = String(entry.code || entry.course_code || entry.subject_code || '').trim();
    const normalizedCode = code.toUpperCase();

    const rawName = String(entry.subject_name || entry.subject || entry.title || '').trim();
    const mappedByCode = subjectByCode.get(normalizedCode) || '';
    const mappedByIndex = backendSubjectNames[index] || '';
    const subjectName = (!rawName || isGenericSubjectLabel(rawName))
      ? (mappedByCode || mappedByIndex || 'Unassigned Subject')
      : rawName;

    const room = String(entry.room || entry.room_name || `Room ${210 + index}`);
    const schedule = String(entry.schedule || entry.time_slot || entry.class_time || ['MWF 9:00-10:30', 'TTH 10:00-11:30', 'MWF 1:00-2:30'][index % 3]);
    const capacity = parseCapacity(entry);

    return {
      code,
      subjectName,
      room,
      schedule,
      capacity,
    };
  });

  return rows.filter((entry) => entry.subjectName && entry.subjectName !== 'Unassigned Subject');
};

function Dashboard() {
  const [enrollment, setEnrollment] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schoolDays, setSchoolDays] = useState(SCHOOL_DAYS_FALLBACK);
  const [miniWeather, setMiniWeather] = useState(null);
  const [miniWeatherLoading, setMiniWeatherLoading] = useState(true);
  const [loadingByWidget, setLoadingByWidget] = useState({
    enrollment: true,
    distribution: true,
    attendance: true,
    subjects: true,
    schoolDays: true,
  });
  const [errorsByWidget, setErrorsByWidget] = useState({
    enrollment: '',
    distribution: '',
    attendance: '',
    subjects: '',
    schoolDays: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoadingByWidget({ enrollment: true, distribution: true, attendance: true, subjects: true, schoolDays: true });
      setErrorsByWidget({ enrollment: '', distribution: '', attendance: '', subjects: '', schoolDays: '' });

      const [enrollmentResult, distributionResult, attendanceResult, subjectsResult, schoolDaysResult] = await Promise.allSettled([
        dashboardApi.getEnrollmentAnalytics(),
        dashboardApi.getProgramDistribution(),
        dashboardApi.getAttendancePatterns(),
        subjectApi.getSubjects(),
        schoolDayApi.getSchoolDays(),
      ]);

      if (!isMounted) {
        return;
      }

      if (enrollmentResult.status === 'fulfilled') {
        setEnrollment(Array.isArray(enrollmentResult.value) ? enrollmentResult.value : []);
      } else {
        setErrorsByWidget((prev) => ({
          ...prev,
          enrollment: extractError(enrollmentResult.reason, 'Unable to load enrollment trends.'),
        }));
      }

      if (distributionResult.status === 'fulfilled') {
        setDistribution(Array.isArray(distributionResult.value) ? distributionResult.value : []);
      } else {
        setErrorsByWidget((prev) => ({
          ...prev,
          distribution: extractError(distributionResult.reason, 'Unable to load course distribution.'),
        }));
      }

      if (attendanceResult.status === 'fulfilled') {
        setAttendance(Array.isArray(attendanceResult.value) ? attendanceResult.value : []);
      } else {
        setErrorsByWidget((prev) => ({
          ...prev,
          attendance: extractError(attendanceResult.reason, 'Unable to load attendance patterns.'),
        }));
      }

      if (subjectsResult.status === 'fulfilled') {
        setSubjects(Array.isArray(subjectsResult.value) ? subjectsResult.value : []);
      } else {
        setErrorsByWidget((prev) => ({
          ...prev,
          subjects: extractError(subjectsResult.reason, 'Unable to load subjects.'),
        }));
        setSubjects([]);
      }

      if (schoolDaysResult.status === 'fulfilled') {
        const rows = Array.isArray(schoolDaysResult.value) ? schoolDaysResult.value : [];
        setSchoolDays(rows.length ? rows : SCHOOL_DAYS_FALLBACK);
      } else {
        setErrorsByWidget((prev) => ({
          ...prev,
          schoolDays: extractError(schoolDaysResult.reason, 'Unable to load school days calendar.'),
        }));
        setSchoolDays(SCHOOL_DAYS_FALLBACK);
      }

      setLoadingByWidget({ enrollment: false, distribution: false, attendance: false, subjects: false, schoolDays: false });
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadMiniWeather = async () => {
      setMiniWeatherLoading(true);

      const applyMiniWeather = (payload) => {
        if (!mounted) {
          return;
        }

        setMiniWeather(payload?.current || null);
      };

      const loadFallbackWeather = async () => {
        const payload = await weatherApi.getDefaultWeather();
        applyMiniWeather(payload);
      };

      try {
        if (!navigator.geolocation) {
          await loadFallbackWeather();
          return;
        }

        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000,
            }
          );
        });

        const payload = await weatherApi.getByCoords(coords.latitude, coords.longitude);
        applyMiniWeather(payload);
      } catch {
        try {
          await loadFallbackWeather();
        } catch {
          if (mounted) {
            setMiniWeather(null);
          }
        }
      } finally {
        if (mounted) {
          setMiniWeatherLoading(false);
        }
      }
    };

    loadMiniWeather();

    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const totalPrograms = distribution.length;
    const totalSubjects = subjects.length;
    const activePrograms = distribution.filter((entry) => {
      const status = String(entry.status || '').toLowerCase();
      return status ? status === 'active' : true;
    }).length;
    const studentsCount = distribution.reduce((acc, entry) => acc + Number(entry.students ?? entry.value ?? entry.total ?? 0), 0);
    const attendanceValues = attendance
      .map((entry) => normalizeAttendanceValue(entry))
      .filter((value) => Number.isFinite(value) && value > 0);
    const averageAttendance = attendanceValues.length
      ? Math.round(attendanceValues.reduce((sum, value) => sum + value, 0) / attendanceValues.length)
      : 0;

    return {
      totalPrograms,
      totalSubjects,
      activePrograms,
      studentsCount,
      averageAttendance,
    };
  }, [distribution, attendance, subjects]);

  const isSummaryLoading = loadingByWidget.distribution || loadingByWidget.attendance || loadingByWidget.subjects;

  const hasGlobalError = Object.values(errorsByWidget).some(Boolean);
  const roomAssignments = useMemo(() => buildRoomAssignments(distribution, subjects), [distribution, subjects]);

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel relative p-5 sm:p-6">
        <div className="sm:pr-[160px]">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <img
                src={BRAND_LOGO_SRC}
                alt="Sandayan Academy logo"
                className="h-10 w-10 rounded-xl object-cover shadow-[0_0_22px_rgba(32,201,255,0.3)]"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/vite.svg';
                }}
              />
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/85">Sandayan Academy</p>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Academic Overview</p>
            <h1 className="mt-2 text-3xl font-bold text-cyan-50">Academic Command Center</h1>
            <p className="mt-2 text-sm text-slate-300">Enrollment monitoring and academic performance overview for Sandayan Academy.</p>
          </div>
        </div>

        <div className="glass-panel-soft mt-3 w-full max-w-[220px] px-2 py-1.5 sm:absolute sm:right-4 sm:top-4 sm:mt-0 sm:w-[142px]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Weather</p>
          {miniWeatherLoading ? (
            <p className="mt-1 text-[11px] text-cyan-100">Loading...</p>
          ) : miniWeather ? (
            <div className="mt-1">
              <p className="truncate text-[11px] font-semibold text-cyan-100">{miniWeather.name}</p>
              <p className="text-[10px] font-semibold text-cyan-100">{Math.round(miniWeather.main?.temp ?? 0)}°C</p>
              <p className="truncate text-[10px] capitalize text-slate-300">{miniWeather.weather?.[0]?.description || 'Clear sky'}</p>
            </div>
          ) : (
            <p className="mt-1 text-[11px] text-slate-300">Unavailable</p>
          )}
        </div>
      </div>

      {hasGlobalError && (
        <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100" role="alert">
          <p className="mb-2 font-semibold">Some widgets could not load:</p>
          <ul className="list-disc space-y-1 pl-5">
            {errorsByWidget.enrollment && <li>{errorsByWidget.enrollment}</li>}
            {errorsByWidget.distribution && <li>{errorsByWidget.distribution}</li>}
            {errorsByWidget.attendance && <li>{errorsByWidget.attendance}</li>}
            {errorsByWidget.subjects && <li>{errorsByWidget.subjects}</li>}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((card) => (
          <article key={card.key} className="glass-panel-soft chart-rise p-4 transition hover:-translate-y-1 hover:border-cyan-200/40">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{card.title}</p>
            <h2 className="mt-3 text-3xl font-bold text-neon">
              {isSummaryLoading
                ? '...'
                : card.key === 'averageAttendance'
                  ? `${summary[card.key] ?? 0}%`
                  : (summary[card.key] ?? 0)}
            </h2>
            <p className="mt-2 text-xs text-slate-400">{card.hint}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="xl:col-span-1">
          {loadingByWidget.enrollment ? (
            <LoadingSkeleton height={280} />
          ) : errorsByWidget.enrollment ? (
            <div className="glass-panel rounded-xl border border-rose-300/25 p-4 text-sm text-rose-100">{errorsByWidget.enrollment}</div>
          ) : (
            <EnrollmentChart data={enrollment} />
          )}
        </div>

        <div className="xl:col-span-1">
          {loadingByWidget.distribution ? (
            <LoadingSkeleton height={280} />
          ) : errorsByWidget.distribution ? (
            <div className="glass-panel rounded-xl border border-rose-300/25 p-4 text-sm text-rose-100">{errorsByWidget.distribution}</div>
          ) : (
            <CourseDistributionChart data={distribution} />
          )}
        </div>

        <div className="xl:col-span-1">
          {loadingByWidget.attendance ? (
            <LoadingSkeleton height={280} />
          ) : errorsByWidget.attendance ? (
            <div className="glass-panel rounded-xl border border-rose-300/25 p-4 text-sm text-rose-100">{errorsByWidget.attendance}</div>
          ) : (
            <AttendanceChart data={attendance} />
          )}
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-cyan-100">Room Assignment and Availability</h3>
          <span className="text-xs text-slate-300">Program, subject code, and subject name overview</span>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm text-slate-200">
            <thead>
              <tr className="border-b border-cyan-200/20 text-xs uppercase tracking-[0.14em] text-slate-300">
                <th className="py-2 pr-3">Subject Name</th>
                <th className="py-2 pr-3">Room</th>
                <th className="py-2 pr-3">Schedule</th>
                <th className="py-2">Student Capacity</th>
              </tr>
            </thead>
            <tbody>
              {roomAssignments.length ? (
                roomAssignments.map((row) => (
                  <tr key={`${row.code}-${row.subjectName}`} className="border-b border-cyan-100/10">
                    <td className="py-2 pr-3 font-semibold text-cyan-100">{row.subjectName}</td>
                    <td className="py-2 pr-3">{row.room}</td>
                    <td className="py-2 pr-3">{row.schedule}</td>
                    <td className="py-2">
                      <span className="inline-flex rounded-full bg-cyan-400/15 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                        {row.capacity}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-300">No room assignments available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div id="academic-calendar">
        <SchoolDaysSection
          rows={schoolDays}
          isLoading={loadingByWidget.schoolDays}
          error={errorsByWidget.schoolDays}
        />
      </div>

      <div>
        <WeatherWidget />
      </div>

      <div className="glass-panel-soft p-4">
        <h3 className="text-sm font-semibold text-cyan-100">Data Reliability Snapshot</h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg bg-slate-900/25 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-300">Total Students</p>
            <p className="mt-1 text-lg font-semibold text-cyan-100">{isSummaryLoading ? '...' : summary.studentsCount}</p>
          </div>
          <div className="rounded-lg bg-slate-900/25 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-300">Total Programs</p>
            <p className="mt-1 text-lg font-semibold text-cyan-100">{isSummaryLoading ? '...' : summary.totalPrograms}</p>
          </div>
          <div className="rounded-lg bg-slate-900/25 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-300">Total Subjects</p>
            <p className="mt-1 text-lg font-semibold text-cyan-100">{isSummaryLoading ? '...' : summary.totalSubjects}</p>
          </div>
          <div className="rounded-lg bg-slate-900/25 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-300">Active Programs</p>
            <p className="mt-1 text-lg font-semibold text-cyan-100">{isSummaryLoading ? '...' : summary.activePrograms}</p>
          </div>
          <div className="rounded-lg bg-slate-900/25 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-300">Average Attendance</p>
            <p className="mt-1 text-lg font-semibold text-cyan-100">{isSummaryLoading ? '...' : `${summary.averageAttendance}%`}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
