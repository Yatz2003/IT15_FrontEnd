function LoadingSpinner({ fullScreen = false, message = 'Loading...' }) {
  return (
    <div className={fullScreen ? 'fullscreen-loader' : 'd-flex justify-content-center py-4'}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" aria-hidden="true" />
        <p className="mt-2 mb-0 text-muted">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
