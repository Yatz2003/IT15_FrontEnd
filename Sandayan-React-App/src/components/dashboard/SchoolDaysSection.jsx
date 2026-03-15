import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import LoadingSkeleton from '../common/LoadingSkeleton';

function SchoolDaysSection({ rows = [], isLoading = false, error = '' }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredRows = useMemo(() => {
    if (!startDate && !endDate) {
      return rows;
    }

    const start = startDate ? Date.parse(startDate) : null;
    const end = endDate ? Date.parse(endDate) : null;

    return rows.filter((entry) => {
      const entryDate = Date.parse(String(entry.dateISO || '').slice(0, 10));

      if (Number.isNaN(entryDate)) {
        return true;
      }

      if (start !== null && !Number.isNaN(start) && entryDate < start) {
        return false;
      }

      if (end !== null && !Number.isNaN(end) && entryDate > end) {
        return false;
      }

      return true;
    });
  }, [rows, startDate, endDate]);

  const chartData = useMemo(() => filteredRows
    .map((entry) => ({
      dateLabel: entry.dateLabel,
      attendanceRate: Number.isFinite(entry.attendanceRate) ? Number(entry.attendanceRate) : 0,
    })), [filteredRows]);

  const upcomingEvents = useMemo(() => {
    const ignored = new Set(['regular classes']);
    const found = [];
    const seen = new Set();

    filteredRows.forEach((entry) => {
      const name = String(entry.eventName || '').trim();
      if (!name) {
        return;
      }

      const normalized = name.toLowerCase();
      if (ignored.has(normalized) || seen.has(normalized)) {
        return;
      }

      seen.add(normalized);
      found.push(name);
    });

    if (!found.length) {
      return ['Research Symposium', 'Sports Festival', 'Final Exams', 'Graduation Day'];
    }

    return found.slice(0, 6);
  }, [filteredRows]);

  return (
    <section className="glass-panel p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-cyan-100">Academic Calendar / School Days</h3>
          <p className="mt-1 text-xs text-slate-300">Attendance trend and event schedule from school day records.</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-[11px] text-slate-300">
            <span className="mb-1 block">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="input-glow rounded-lg border border-cyan-200/25 bg-slate-900/35 px-2.5 py-1.5 text-xs text-white outline-none"
            />
          </label>
          <label className="text-[11px] text-slate-300">
            <span className="mb-1 block">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="input-glow rounded-lg border border-cyan-200/25 bg-slate-900/35 px-2.5 py-1.5 text-xs text-white outline-none"
            />
          </label>
          <button
            type="button"
            className="rounded-lg border border-cyan-200/25 bg-slate-900/30 px-2.5 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-slate-800/45"
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <LoadingSkeleton height={250} />
          </div>
          <div>
            <LoadingSkeleton height={250} />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
            <div className="glass-panel-soft p-3 xl:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/85">Attendance Trend</p>
              <div className="mt-2" style={{ height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 6, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid stroke="rgba(148, 192, 255, 0.2)" strokeDasharray="3 3" />
                    <XAxis dataKey="dateLabel" stroke="rgba(202, 227, 255, 0.85)" tick={{ fontSize: 10 }} />
                    <YAxis
                      domain={[0, 100]}
                      stroke="rgba(202, 227, 255, 0.85)"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line
                      type="monotone"
                      dataKey="attendanceRate"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      dot={{ r: 3, stroke: '#22d3ee', fill: '#0b1220' }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel-soft p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/85">Upcoming Events</p>
              <ul className="mt-2 space-y-2">
                {upcomingEvents.map((eventName) => (
                  <li key={eventName} className="rounded-lg border border-cyan-200/20 bg-slate-900/25 px-3 py-2 text-sm text-slate-200">
                    {eventName}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-3 max-h-[420px] overflow-auto rounded-xl border border-cyan-200/18">
            <table className="w-full min-w-[740px] text-left text-sm text-slate-200">
              <thead className="bg-cyan-500/10 text-xs uppercase tracking-[0.16em] text-cyan-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Day</th>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Attendance</th>
                  <th className="px-4 py-3 font-semibold">Holiday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-100/10 bg-slate-950/20">
                {filteredRows.map((entry) => (
                  <tr key={entry.id} className={entry.isHoliday ? 'bg-rose-500/8' : 'hover:bg-cyan-400/6'}>
                    <td className="px-4 py-3 font-medium text-cyan-100">{entry.dateLabel}</td>
                    <td className="px-4 py-3">{entry.dayName}</td>
                    <td className="px-4 py-3">{entry.eventName}</td>
                    <td className="px-4 py-3">
                      {entry.isHoliday ? (
                        <span className="inline-flex rounded-full bg-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-100">Holiday</span>
                      ) : (
                        `${Math.round(Number(entry.attendanceRate || 0))}%`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entry.isHoliday ? (
                        <span className="inline-flex rounded-full border border-rose-300/40 bg-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-100">Holiday</span>
                      ) : (
                        <span className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-100">School Day</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!filteredRows.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-5 text-center text-slate-300">No school day records in the selected date range.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

export default SchoolDaysSection;
