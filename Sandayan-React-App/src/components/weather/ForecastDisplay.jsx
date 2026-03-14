function ForecastDisplay({ items }) {
  if (!items.length) {
    return <p className="mt-2 text-xs text-slate-400">No forecast data yet.</p>;
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item) => {
        const date = new Date(item.dt * 1000);
        return (
          <div className="glass-panel-soft rounded-lg p-3" key={item.dt}>
            <p className="text-xs text-slate-300">{date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
            <div className="mt-2 flex items-center justify-between">
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon || '01d'}@2x.png`}
                  alt={item.weather?.[0]?.description || 'Weather icon'}
                  width="42"
                  height="42"
                />
              <span className="text-sm font-semibold text-cyan-100">{Math.round(item.main?.temp || 0)} C</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ForecastDisplay;
