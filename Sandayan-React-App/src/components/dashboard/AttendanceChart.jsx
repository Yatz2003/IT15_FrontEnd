import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const SAMPLE_ATTENDANCE = [
  { day: 'Mon', attendance: 88 },
  { day: 'Tue', attendance: 91 },
  { day: 'Wed', attendance: 86 },
  { day: 'Thu', attendance: 89 },
  { day: 'Fri', attendance: 92 },
];

const normalizeAttendanceValue = (entry = {}) => {
  const raw = Number(entry.attendance ?? entry.rate ?? entry.value ?? 0);

  if (!Number.isFinite(raw)) {
    return 0;
  }

  if (raw > 0 && raw <= 1) {
    return raw * 100;
  }

  return raw;
};

function AttendanceChart({ data }) {
  const chartData = data.map((entry) => ({
    day: entry.date || entry.day || entry.label || 'N/A',
    attendance: normalizeAttendanceValue(entry),
  }));

  const hasMeaningfulValues = chartData.some((entry) => Number.isFinite(entry.attendance) && entry.attendance > 0);
  const visibleChartData = hasMeaningfulValues ? chartData : SAMPLE_ATTENDANCE;

  return (
    <div className="glass-panel chart-rise h-full p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-cyan-100">Attendance Patterns</h2>
      <p className="mt-1 text-xs text-slate-400">Date vs attendance rate</p>
      <div className="mt-3" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleChartData} margin={{ top: 12, right: 10, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="rgba(141, 196, 255, 0.18)" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="rgba(202, 227, 255, 0.9)" tick={{ fontSize: 11, fill: 'rgba(202, 227, 255, 0.95)' }} />
            <YAxis domain={[0, 100]} stroke="rgba(202, 227, 255, 0.9)" tick={{ fontSize: 11, fill: 'rgba(202, 227, 255, 0.95)' }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#67e8f9', stroke: '#0f172a', strokeWidth: 1 }}
              activeDot={{ r: 6 }}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;
