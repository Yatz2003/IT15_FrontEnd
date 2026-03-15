function SettingsPage() {
  return (
    <section className="mx-auto grid max-w-[1400px] gap-4">
      <div className="glass-panel p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">System Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-50">System Settings</h1>
        <p className="mt-2 text-sm text-slate-300">Configure user preferences, visual behavior, and integration options for the dashboard.</p>
      </div>

      <div className="glass-panel-soft p-5">
        <h2 className="text-sm font-semibold text-cyan-100">Quick Toggles</h2>
        <p className="mt-2 text-sm text-slate-300">Theme and notification toggles can be connected here without backend contract changes.</p>
      </div>
    </section>
  );
}

export default SettingsPage;
