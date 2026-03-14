import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#72f9ff', '#1f76ff', '#29f9af', '#ffd66b', '#c88bff', '#ff8d8d'];

function CourseDistributionChart({ data }) {
  const chartData = data.map((entry, index) => ({
    id: index,
    course: entry.course || entry.name || `Course ${index + 1}`,
    value: Number(entry.students ?? entry.value ?? entry.total ?? 0),
  }));

  return (
    <div className="glass-panel chart-rise h-full p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-cyan-100">Course Distribution</h2>
      <p className="mt-1 text-xs text-slate-400">Students split by course category</p>
      <div className="mt-3" style={{ height: 280 }}>
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
              animationDuration={900}
            >
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={COLORS[entry.id % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, color: '#d4e6ff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CourseDistributionChart;
