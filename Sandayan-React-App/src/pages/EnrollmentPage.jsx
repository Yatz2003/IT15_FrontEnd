function EnrollmentPage() {
  return (
    <section className="mx-auto grid max-w-[1400px] gap-4">
      <div className="glass-panel p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Enrollment</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-50">Enrollment Management</h1>
        <p className="mt-2 text-sm text-slate-300">Track cohort movement, term admissions, and retention touchpoints across programs.</p>
      </div>

      <div className="glass-panel-soft p-5">
        <h2 className="text-sm font-semibold text-cyan-100">Insights in Progress</h2>
        <p className="mt-2 text-sm text-slate-300">Use Overview analytics for trend charts while this module is expanded with specialized enrollment workflows.</p>
      </div>
    </section>
  );
}

export default EnrollmentPage;
