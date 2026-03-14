import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function AttendanceChart({ data }) {
  const chartData = data.map((entry) => ({
    day: entry.date || entry.day || entry.label || 'N/A',
    attendance: Number(entry.attendance ?? entry.rate ?? entry.value ?? 0),
  }));

  return (
    <div className="glass-panel chart-rise h-full p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-cyan-100">Attendance Patterns</h2>
      <p className="mt-1 text-xs text-slate-400">Date vs attendance rate</p>
      <div className="mt-3" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 12, right: 10, left: 0, bottom: 8 }} barCategoryGap="22%">
            <CartesianGrid stroke="rgba(141, 196, 255, 0.18)" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="rgba(202, 227, 255, 0.9)" tick={{ fontSize: 11, fill: 'rgba(202, 227, 255, 0.95)' }} />
            <YAxis domain={[0, 100]} stroke="rgba(202, 227, 255, 0.9)" tick={{ fontSize: 11, fill: 'rgba(202, 227, 255, 0.95)' }} />
            <Tooltip />
            <Bar dataKey="attendance" fill="#0f766e" radius={[6, 6, 0, 0]} maxBarSize={34} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;
