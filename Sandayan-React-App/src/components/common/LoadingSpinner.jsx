const BRAND_LOGO_SRC = '/brand/SandayanAcademy.png';

function LoadingSpinner({ fullScreen = false, message = 'Loading...', showBrand = false }) {
  const spinner = (
    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-cyan-100/20 border-t-cyan-300" role="status" aria-hidden="true" />
  );

  if (fullScreen && showBrand) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <img
          src={BRAND_LOGO_SRC}
          alt="Sandayan Academy background"
          className="absolute inset-0 h-full w-full object-cover brightness-110"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/vite.svg';
          }}
        />
        <div className="absolute inset-0 bg-slate-950/45" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,240,220,0.14),transparent_42%),radial-gradient(circle_at_80%_12%,rgba(67,105,255,0.18),transparent_44%)]" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-sm rounded-3xl border border-cyan-200/30 bg-slate-900/25 p-6 text-center shadow-[0_18px_44px_rgba(1,8,30,0.45)] backdrop-blur-xl">
          <img
            src={BRAND_LOGO_SRC}
            alt="Sandayan Academy logo"
            className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-[0_0_30px_rgba(31,210,255,0.4)]"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/vite.svg';
            }}
          />
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-cyan-100/90">Sandayan Academy</p>
          <div className="mt-4">{spinner}</div>
          <p className="mt-3 text-sm text-slate-100">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={fullScreen ? 'flex min-h-screen items-center justify-center' : 'flex justify-center py-8'}>
      <div className="glass-panel w-full max-w-xs p-5 text-center">
        {spinner}
        <p className="mt-3 text-sm text-slate-200">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
