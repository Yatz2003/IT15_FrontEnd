function LoadingSkeleton({ height = 220 }) {
  return (
    <div className="glass-panel skeleton-shimmer h-full p-4">
      <div className="mb-3 h-4 w-2/5 rounded-full bg-cyan-100/15" />
      <div className="rounded-xl bg-cyan-100/8" style={{ height }}>
        <div className="h-full w-full rounded-xl bg-gradient-to-r from-cyan-100/5 via-cyan-200/10 to-cyan-100/5" />
      </div>
    </div>
  );
}

export default LoadingSkeleton;
