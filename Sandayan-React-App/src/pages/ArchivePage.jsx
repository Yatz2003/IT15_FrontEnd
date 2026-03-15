import { useMemo, useState } from 'react';
import archiveService from '../services/archiveService';

function ArchivePage() {
  const [items, setItems] = useState(() => archiveService.getArchivedItems());

  const summary = useMemo(() => {
    return items.reduce((acc, item) => {
      const key = String(item.entityType || 'Record').trim() || 'Record';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  const summaryEntries = Object.entries(summary).sort((a, b) => b[1] - a[1]);

  const clearArchive = () => {
    const shouldClear = window.confirm('Clear all archived deleted records?');

    if (!shouldClear) {
      return;
    }

    archiveService.clearArchivedItems();
    setItems([]);
  };

  const restoreItem = (archiveId) => {
    const restored = archiveService.restoreArchivedItem(archiveId);

    if (!restored) {
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== archiveId));
  };

  const undoLastDelete = () => {
    const restored = archiveService.restoreLatestArchivedItem();

    if (!restored) {
      return;
    }

    setItems((prev) => prev.slice(1));
  };

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-50">Record Recovery Center</h1>
            <p className="mt-2 text-sm text-slate-300">Deleted records from students, programs, subjects, and other modules are safely stored here for recovery.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-emerald-300/35 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-55"
              onClick={undoLastDelete}
              disabled={items.length === 0}
            >
              Undo Last Delete
            </button>
            <button
              type="button"
              className="rounded-xl border border-rose-300/35 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-55"
              onClick={clearArchive}
              disabled={items.length === 0}
            >
              Clear Deleted Data
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">Deleted Records Dashboard</h2>
        {summaryEntries.length === 0 ? (
          <p className="mt-3 text-sm text-slate-300">No deleted records yet.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summaryEntries.map(([entityType, count]) => (
              <div key={entityType} className="rounded-xl border border-cyan-200/20 bg-slate-900/45 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">{entityType}</p>
                <p className="mt-1 text-2xl font-semibold text-cyan-100">{count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel p-4 sm:p-5">
        <div className="overflow-x-auto rounded-xl border border-cyan-200/18">
          <table className="w-full min-w-[760px] text-left text-sm text-slate-200">
            <thead className="bg-cyan-500/10 text-xs uppercase tracking-[0.16em] text-cyan-100">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Deleted Record</th>
                <th className="px-4 py-3 font-semibold">Deleted At</th>
                <th className="px-4 py-3 font-semibold">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-100/10 bg-slate-950/20">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-300">No deleted records in the recovery center.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="transition hover:bg-cyan-400/6">
                    <td className="px-4 py-3">{item.entityType}</td>
                    <td className="px-4 py-3 font-semibold text-cyan-100">{item.label}</td>
                    <td className="px-4 py-3">{new Date(item.deletedAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-lg border border-emerald-300/35 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/25"
                        onClick={() => restoreItem(item.id)}
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ArchivePage;
