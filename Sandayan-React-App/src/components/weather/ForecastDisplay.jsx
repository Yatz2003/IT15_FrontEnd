function ForecastDisplay({ items, selectedIndex = 0, onSelectDay, className = '' }) {
  if (!items.length) {
    return <p className="mt-2 text-xs text-slate-400">No forecast data yet.</p>;
  }

  const buildDayName = (item, index) => {
    if (item.day) {
      return String(item.day).slice(0, 3);
    }

    const date = new Date(Number(item.dt || 0) * 1000);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }

    const fallback = new Date();
    fallback.setDate(fallback.getDate() + index);
    return fallback.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div className={`mt-2.5 grid h-full auto-rows-fr grid-cols-1 items-stretch gap-1.5 sm:grid-cols-2 lg:grid-cols-5 ${className}`.trim()}>
      {items.map((item, index) => {
        const dayName = buildDayName(item, index);
        const label = index === 0 ? `Today (${dayName})` : dayName;
        const isSelected = selectedIndex === index;

        return (
          <button
            type="button"
            className={`weather-day-card glass-panel-soft h-full rounded-lg p-2 text-left transition ${isSelected ? 'weather-day-card-active border border-cyan-200/60 bg-cyan-400/12' : ''}`}
            key={`${item.dt}-${index}`}
            onClick={() => onSelectDay?.(index)}
          >
            <p className="text-[11px] text-slate-300">{label}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon || '01d'}@2x.png`}
                  alt={item.description || 'Weather icon'}
                  width="46"
                  height="46"
                  className="weather-day-icon"
                />
              <span className="text-sm font-semibold text-cyan-100">{Math.round(item.temp || 0)}°</span>
            </div>
            <p className="truncate text-[11px] capitalize text-slate-300">{item.description || 'Clear sky'}</p>
          </button>
        );
      })}
    </div>
  );
}

export default ForecastDisplay;
