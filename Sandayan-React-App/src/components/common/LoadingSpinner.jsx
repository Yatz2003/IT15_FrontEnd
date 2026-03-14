function LoadingSpinner({ fullScreen = false, message = 'Loading...' }) {
  return (
    <div className={fullScreen ? 'flex min-h-screen items-center justify-center' : 'flex justify-center py-8'}>
      <div className="glass-panel w-full max-w-xs p-5 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-cyan-100/20 border-t-cyan-300" role="status" aria-hidden="true" />
        <p className="mt-3 text-sm text-slate-200">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
