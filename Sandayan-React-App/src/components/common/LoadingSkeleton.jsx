function LoadingSkeleton({ height = 220 }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="placeholder-glow mb-3">
          <span className="placeholder col-5" />
        </div>
        <div className="placeholder-glow" style={{ height }}>
          <span className="placeholder col-12 h-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
