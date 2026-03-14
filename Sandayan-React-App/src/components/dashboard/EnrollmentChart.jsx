import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function EnrollmentChart({ data }) {
  const chartData = data.map((entry) => ({
    month: entry.month || entry.label || 'N/A',
    total: Number(entry.total ?? entry.count ?? entry.enrollment ?? 0),
  }));

  return (
    <div className="glass-panel chart-rise h-full p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-cyan-100">Monthly Enrollment Trends</h2>
      <p className="mt-1 text-xs text-slate-400">Enrollment records by month</p>
      <div className="mt-3" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 12, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid stroke="rgba(141, 196, 255, 0.18)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="rgba(202, 227, 255, 0.8)" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} stroke="rgba(202, 227, 255, 0.8)" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="total" fill="url(#enrollmentGlow)" radius={[6, 6, 0, 0]} animationDuration={900} />
            <defs>
              <linearGradient id="enrollmentGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#72f9ff" />
                <stop offset="100%" stopColor="#1f76ff" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EnrollmentChart;
