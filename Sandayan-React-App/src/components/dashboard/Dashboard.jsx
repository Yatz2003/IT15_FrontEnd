import { useEffect, useMemo, useState } from 'react';
import EnrollmentChart from './EnrollmentChart';
import CourseDistributionChart from './CourseDistributionChart';
import AttendanceChart from './AttendanceChart';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { dashboardApi } from '../../services/api';
import WeatherWidget from '../weather/WeatherWidget';

const extractError = (error, fallback) => error.response?.data?.message || error.message || fallback;

const metricCards = [
  { key: 'totalPrograms', title: 'Total Programs', hint: 'Registered curriculum tracks' },
  { key: 'totalSubjects', title: 'Total Subjects', hint: 'Available learning units' },
  { key: 'activePrograms', title: 'Active Programs', hint: 'Programs currently running' },
  { key: 'studentsCount', title: 'Students Count', hint: 'Total enrolled learners' },
];

function Dashboard() {
  const [enrollment, setEnrollment] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loadingByWidget, setLoadingByWidget] = useState({
    enrollment: true,
    distribution: true,
    attendance: true,
  });
  const [errorsByWidget, setErrorsByWidget] = useState({
    enrollment: '',
    distribution: '',
    attendance: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoadingByWidget({ enrollment: true, distribution: true, attendance: true });
      setErrorsByWidget({ enrollment: '', distribution: '', attendance: '' });

      const [enrollmentResult, distributionResult, attendanceResult] = await Promise.allSettled([
        dashboardApi.getEnrollmentTrends(),
        dashboardApi.getCourseDistribution(),
        dashboardApi.getAttendanceData(),
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

      setLoadingByWidget({ enrollment: false, distribution: false, attendance: false });
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => ({
    totalPrograms: distribution.length,
    totalSubjects: distribution.reduce((acc, entry) => {
      const subjectCount = Number(entry.subjects ?? entry.subject_count ?? 1);
      return acc + (Number.isFinite(subjectCount) ? subjectCount : 1);
    }, 0),
    activePrograms: distribution.filter((entry) => {
      const status = String(entry.status || '').toLowerCase();
      return status ? status === 'active' : true;
    }).length,
    studentsCount: distribution.reduce((acc, entry) => acc + Number(entry.students ?? entry.value ?? entry.total ?? 0), 0),
    enrollmentPoints: enrollment.length,
    courseGroups: distribution.length,
    attendanceDays: attendance.length,
  }), [enrollment.length, distribution.length, attendance.length]);

  const hasGlobalError = Object.values(errorsByWidget).some(Boolean);

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Overview</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-50">Academic Command Center</h1>
        <p className="mt-2 text-sm text-slate-300">Live analytics from Laravel REST endpoints with resilient real-time visuals.</p>
      </div>

      {hasGlobalError && (
        <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100" role="alert">
          <p className="mb-2 font-semibold">Some widgets could not load:</p>
          <ul className="list-disc space-y-1 pl-5">
            {errorsByWidget.enrollment && <li>{errorsByWidget.enrollment}</li>}
            {errorsByWidget.distribution && <li>{errorsByWidget.distribution}</li>}
            {errorsByWidget.attendance && <li>{errorsByWidget.attendance}</li>}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <article key={card.key} className="glass-panel-soft chart-rise p-4 transition hover:-translate-y-1 hover:border-cyan-200/40">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{card.title}</p>
            <h2 className="mt-3 text-3xl font-bold text-neon">{summary[card.key] ?? 0}</h2>
            <p className="mt-2 text-xs text-slate-400">{card.hint}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          {loadingByWidget.enrollment ? (
            <LoadingSkeleton height={280} />
          ) : errorsByWidget.enrollment ? (
            <div className="glass-panel rounded-xl border border-rose-300/25 p-4 text-sm text-rose-100">{errorsByWidget.enrollment}</div>
          ) : (
            <EnrollmentChart data={enrollment} />
          )}

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {loadingByWidget.distribution ? (
              <LoadingSkeleton height={280} />
            ) : errorsByWidget.distribution ? (
              <div className="glass-panel rounded-xl border border-rose-300/25 p-4 text-sm text-rose-100">{errorsByWidget.distribution}</div>
            ) : (
              <CourseDistributionChart data={distribution} />
            )}

            {loadingByWidget.attendance ? (
              <LoadingSkeleton height={280} />
            ) : errorsByWidget.attendance ? (
              <div className="glass-panel rounded-xl border border-rose-300/25 p-4 text-sm text-rose-100">{errorsByWidget.attendance}</div>
            ) : (
              <AttendanceChart data={attendance} />
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <WeatherWidget />
          <div className="glass-panel-soft mt-3 p-4">
            <h3 className="text-sm font-semibold text-cyan-100">Data Reliability Snapshot</h3>
            <p className="mt-2 text-xs text-slate-300">Enrollment points: {summary.enrollmentPoints}</p>
            <p className="mt-1 text-xs text-slate-300">Course groups: {summary.courseGroups}</p>
            <p className="mt-1 text-xs text-slate-300">Attendance days: {summary.attendanceDays}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
