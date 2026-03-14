function ReportsPage() {
  return (
    <section className="mx-auto grid max-w-[1400px] gap-4">
      <div className="glass-panel p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Reports</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-50">Reports Hub</h1>
        <p className="mt-2 text-sm text-slate-300">Build consolidated academic and operational snapshots from dashboard intelligence.</p>
      </div>

      <div className="glass-panel-soft p-5">
        <h2 className="text-sm font-semibold text-cyan-100">Automated Exports</h2>
        <p className="mt-2 text-sm text-slate-300">CSV/PDF export presets can be wired to API report endpoints while keeping this interface intact.</p>
      </div>
    </section>
  );
}

export default ReportsPage;
