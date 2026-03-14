import { useEffect, useMemo, useState } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

const PAGE_SIZE = 6;

const toInitialForm = (columns, row = null) => {
  const next = {};

  columns.forEach((column) => {
    next[column.key] = row?.[column.key] ?? '';
  });

  return next;
};

function CrudTablePage({ title, description, entityLabel, columns, initialRows }) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({ open: false, mode: 'create', rowId: null });
  const [form, setForm] = useState(() => toInitialForm(columns));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 550);

    return () => clearTimeout(timeoutId);
  }, []);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return rows;
    }

    return rows.filter((row) => columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(term)));
  }, [columns, rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRows]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const openCreateModal = () => {
    setForm(toInitialForm(columns));
    setModalState({ open: true, mode: 'create', rowId: null });
  };

  const openEditModal = (row) => {
    setForm(toInitialForm(columns, row));
    setModalState({ open: true, mode: 'edit', rowId: row.id });
  };

  const closeModal = () => {
    setModalState({ open: false, mode: 'create', rowId: null });
  };

  const saveRecord = () => {
    if (modalState.mode === 'create') {
      const nextId = rows.length ? Math.max(...rows.map((row) => Number(row.id) || 0)) + 1 : 1;
      setRows((prev) => [...prev, { id: nextId, ...form }]);
    } else {
      setRows((prev) => prev.map((row) => (row.id === modalState.rowId ? { ...row, ...form } : row)));
    }

    closeModal();
  };

  return (
    <section className="mx-auto max-w-[1400px] space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Data Module</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-50">{title}</h1>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
      </div>

      <div className="glass-panel p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            className="input-glow w-full rounded-xl border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none sm:max-w-sm"
            placeholder={`Search ${entityLabel.toLowerCase()}...`}
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Add {entityLabel}
          </button>
        </div>

        {isLoading ? (
          <LoadingSkeleton height={340} />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-cyan-200/18">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="bg-cyan-500/10 text-xs uppercase tracking-[0.2em] text-cyan-100">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
                    ))}
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100/10 bg-slate-950/20">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-slate-400">
                        No matching records.
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row) => (
                      <tr key={row.id} className="transition hover:bg-cyan-400/6">
                        {columns.map((column) => (
                          <td key={column.key} className="px-4 py-3">{row[column.key]}</td>
                        ))}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            className="rounded-lg border border-cyan-200/30 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
              <p>
                Showing {(currentPage - 1) * PAGE_SIZE + (paginatedRows.length ? 1 : 0)}-
                {(currentPage - 1) * PAGE_SIZE + paginatedRows.length} of {filteredRows.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md border border-cyan-200/30 px-2.5 py-1 transition hover:bg-cyan-400/10 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  Prev
                </button>
                <span>Page {currentPage} / {totalPages}</span>
                <button
                  type="button"
                  className="rounded-md border border-cyan-200/30 px-2.5 py-1 transition hover:bg-cyan-400/10 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {modalState.open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4">
          <div className="glass-panel w-full max-w-lg p-5">
            <h2 className="text-lg font-semibold text-cyan-100">
              {modalState.mode === 'create' ? `Add ${entityLabel}` : `Edit ${entityLabel}`}
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {columns.map((column) => (
                <label key={column.key} className="text-xs text-slate-300">
                  {column.label}
                  <input
                    className="input-glow mt-1 w-full rounded-lg border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none"
                    value={form[column.key] ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, [column.key]: event.target.value }))}
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-300/30 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-600/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveRecord}
                className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:brightness-110"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CrudTablePage;
