import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0d6efd', '#198754', '#dc3545', '#fd7e14', '#6f42c1', '#20c997'];

function CourseDistributionChart({ data }) {
  const chartData = data.map((entry, index) => ({
    id: index,
    course: entry.course || entry.name || `Course ${index + 1}`,
    value: Number(entry.students ?? entry.value ?? entry.total ?? 0),
  }));

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h2 className="h6 fw-semibold mb-3">Student Distribution by Course</h2>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                nameKey="course"
                label
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={COLORS[entry.id % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CourseDistributionChart;
