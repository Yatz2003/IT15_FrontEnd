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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h2 className="h6 fw-semibold mb-3">Attendance Patterns by School Day</h2>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 12, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#198754" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AttendanceChart;
