import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import reportsApi from '../services/reportsApi';

const PIE_COLORS = ['#22d3ee', '#3b82f6', '#06b6d4', '#0ea5e9', '#14b8a6', '#0284c7'];
const extractError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

function Reports() {
  const [enrollmentSummary, setEnrollmentSummary] = useState([]);
  const [programDistribution, setProgramDistribution] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadReports = async () => {
      setIsLoading(true);
      setError('');

      const [enrollmentResult, distributionResult, attendanceResult] = await Promise.allSettled([
        reportsApi.getEnrollmentSummary(),
        reportsApi.getProgramDistribution(),
        reportsApi.getAttendanceSummary(),
      ]);

      if (!mounted) {
        return;
      }

      const errors = [];

      if (enrollmentResult.status === 'fulfilled') {
        setEnrollmentSummary(enrollmentResult.value);
      } else {
        errors.push(extractError(enrollmentResult.reason, 'Unable to load enrollment summary.'));
      }

      if (distributionResult.status === 'fulfilled') {
        setProgramDistribution(distributionResult.value);
      } else {
        errors.push(extractError(distributionResult.reason, 'Unable to load program distribution.'));
      }

      if (attendanceResult.status === 'fulfilled') {
        setAttendanceSummary(attendanceResult.value);
      } else {
        errors.push(extractError(attendanceResult.reason, 'Unable to load attendance summary.'));
      }

      setError(errors.join(' '));
      setIsLoading(false);
    };

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  const hasNoData = useMemo(
    () => !enrollmentSummary.length && !programDistribution.length && !attendanceSummary.length,
    [enrollmentSummary, programDistribution, attendanceSummary]
  );

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <h1 className="text-3xl font-bold text-cyan-50">Academic Reports</h1>
        <p className="mt-2 text-sm text-slate-300">Enrollment, program, and attendance insights sourced from report endpoints.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <LoadingSkeleton height={300} />
          <LoadingSkeleton height={300} />
          <LoadingSkeleton height={300} />
        </div>
      ) : hasNoData ? (
        <div className="glass-panel-soft p-5 text-sm text-slate-300">No report data available from the API.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <div className="glass-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/85">Enrollment Summary</p>
            <div className="mt-3" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentSummary} margin={{ top: 6, right: 8, left: 0, bottom: 4 }}>
                  <XAxis dataKey="label" stroke="rgba(202, 227, 255, 0.85)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(202, 227, 255, 0.85)" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/85">Program Distribution</p>
            <div className="mt-3" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={programDistribution} dataKey="value" nameKey="name" outerRadius={78} label>
                    {programDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/85">Attendance Trends</p>
            <div className="mt-3" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceSummary} margin={{ top: 6, right: 8, left: 0, bottom: 4 }}>
                  <XAxis dataKey="label" stroke="rgba(202, 227, 255, 0.85)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="rgba(202, 227, 255, 0.85)" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line type="monotone" dataKey="attendance" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Reports;
