import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function AttendanceChart({ data }) {
  const chartData = data.map((entry) => ({
    day: entry.day || entry.label || 'N/A',
    attendance: Number(entry.attendance ?? entry.rate ?? entry.value ?? 0),
  }));

  return (
    <div className="glass-panel chart-rise h-full p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-cyan-100">Attendance Patterns</h2>
      <p className="mt-1 text-xs text-slate-400">Attendance rate across school days</p>
      <div className="mt-3" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid stroke="rgba(141, 196, 255, 0.18)" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="rgba(202, 227, 255, 0.8)" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} stroke="rgba(202, 227, 255, 0.8)" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="attendance" stroke="#37f6d4" strokeWidth={3} dot={{ r: 3 }} animationDuration={900} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;
