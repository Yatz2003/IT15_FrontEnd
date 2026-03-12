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
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h2 className="h6 fw-semibold mb-3">Monthly Enrollment Trends</h2>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#0d6efd" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentChart;
