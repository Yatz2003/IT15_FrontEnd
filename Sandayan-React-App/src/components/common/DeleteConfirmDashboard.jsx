function DeleteConfirmDashboard({
  open,
  title,
  message,
  entityType,
  recordLabel,
  onCancel,
  onConfirm,
  confirmText = 'Confirm Delete',
  cancelText = 'Cancel',
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/75 px-4">
      <div className="glass-panel w-full max-w-xl p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-100/85">Delete Options</p>
        <h3 className="mt-2 text-xl font-semibold text-cyan-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{message}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-cyan-200/20 bg-slate-900/45 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">Record</p>
            <p className="mt-1 text-sm font-semibold text-cyan-100">{recordLabel || 'Untitled record'}</p>
          </div>
          <div className="rounded-xl border border-cyan-200/20 bg-slate-900/45 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">Type</p>
            <p className="mt-1 text-sm font-semibold text-cyan-100">{entityType || 'Record'}</p>
          </div>
          <div className="rounded-xl border border-rose-300/30 bg-rose-500/12 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-rose-100/85">Action</p>
            <p className="mt-1 text-sm font-semibold text-rose-100">Move to Recovery Center</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-cyan-200/30 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-slate-700/35"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/25"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDashboard;
