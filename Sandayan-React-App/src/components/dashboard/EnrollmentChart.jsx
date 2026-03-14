import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const YEAR_PATTERN = /(19|20)\d{2}/;
const START_YEAR = 2015;

function EnrollmentChart({ data }) {
  const [selectedYear, setSelectedYear] = useState('all');
  const currentYear = new Date().getFullYear();

  const totalsByYear = data.reduce((acc, entry) => {
    const rawYear = entry.year || entry.academic_year || entry.label || entry.name || '';
    const parsedYear = String(rawYear).match(YEAR_PATTERN)?.[0] || '';
    const year = Number(parsedYear);

    if (!Number.isFinite(year) || year < START_YEAR || year > currentYear) {
      return acc;
    }

    const total = Number(entry.total ?? entry.count ?? entry.enrollment ?? entry.value ?? 0);
    const safeTotal = Number.isFinite(total) ? total : 0;
    acc[year] = (acc[year] || 0) + safeTotal;
    return acc;
  }, {});

  const safeChartData = Array.from({ length: currentYear - START_YEAR + 1 }, (_, offset) => {
    const year = START_YEAR + offset;
    return {
      year: String(year),
      total: totalsByYear[year] || 0,
    };
  });

  const growthChartData = safeChartData.map((entry, index) => {
    if (index === 0) {
      return { ...entry, growth: 0 };
    }

    const previous = safeChartData[index - 1].total;
    const current = entry.total;

    const growth = previous > 0
      ? ((current - previous) / previous) * 100
      : (current > 0 ? 100 : 0);

    return {
      ...entry,
      growth: Math.round(growth * 100) / 100,
    };
  });

  const yearOptions = safeChartData.map((entry) => String(entry.year));

  const displayData = selectedYear === 'all'
    ? growthChartData
    : growthChartData.filter((entry) => String(entry.year) === selectedYear);

  return (
    <div className="glass-panel chart-rise h-full p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-cyan-100">Enrollment Analytics</h2>
          <p className="mt-1 text-xs text-slate-300">Enrollment totals by calendar year</p>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs">📅</span>
          <select
            aria-label="Choose calendar year"
            title="Choose calendar year"
            className="rounded-md border border-cyan-200/30 bg-slate-900/55 pl-7 pr-2 py-1 text-xs text-slate-100 outline-none"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          >
            <option value="all">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 14, right: 16, left: 2, bottom: 10 }}>
            <CartesianGrid stroke="rgba(125, 160, 202, 0.28)" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              stroke="rgba(220, 235, 255, 0.95)"
              tick={{ fontSize: 11, fill: 'rgba(220, 235, 255, 0.95)' }}
              tickMargin={10}
              interval={0}
            />
            <YAxis
              unit="%"
              stroke="rgba(220, 235, 255, 0.95)"
              tick={{ fontSize: 12, fill: 'rgba(220, 235, 255, 0.95)' }}
              tickMargin={8}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'growth') {
                  return [`${Number(value).toFixed(2)}%`, 'Growth'];
                }
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                const total = payload?.[0]?.payload?.total ?? 0;
                return `Year ${label} | Enrollment: ${total}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="growth"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 3, fill: '#22d3ee' }}
              activeDot={{ r: 5 }}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EnrollmentChart;
