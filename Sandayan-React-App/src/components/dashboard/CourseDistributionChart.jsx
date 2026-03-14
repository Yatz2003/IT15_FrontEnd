import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#1d4ed8', '#0f766e', '#b45309', '#be123c', '#7c3aed', '#0369a1', '#15803d'];

function CourseDistributionChart({ data }) {
  const chartData = data.map((entry, index) => ({
    id: index,
    course: entry.program || entry.course || entry.name || `Program ${index + 1}`,
    value: Number(entry.students ?? entry.value ?? entry.total ?? 0),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="glass-panel chart-rise h-full p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-cyan-100">Course Distribution</h2>
      <p className="mt-1 text-xs text-slate-300">Distribution of students across offered courses</p>
      <div className="glass-panel-soft mt-3 h-[280px] rounded-xl p-3">
        <div className="flex h-full flex-col gap-3 sm:flex-row">
          <div className="h-[120px] sm:h-full sm:w-[44%]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={72}
                  innerRadius={40}
                  dataKey="value"
                  nameKey="course"
                  label={false}
                  animationDuration={900}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              {chartData.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-2 rounded-md bg-slate-900/30 px-2 py-1.5 text-xs text-slate-100">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="truncate text-slate-100">{entry.course}</span>
                  </div>
                  <span className="shrink-0 font-semibold text-cyan-100">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDistributionChart;
