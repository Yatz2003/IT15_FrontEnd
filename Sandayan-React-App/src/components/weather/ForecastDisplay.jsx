function ForecastDisplay({ items }) {
  if (!items.length) {
    return <p className="text-muted mb-0">No forecast data yet.</p>;
  }

  return (
    <div className="row g-2 mt-1">
      {items.map((item) => {
        const date = new Date(item.dt * 1000);
        return (
          <div className="col-6" key={item.dt}>
            <div className="forecast-pill">
              <p className="small text-muted mb-1">{date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
              <div className="d-flex align-items-center justify-content-between">
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon || '01d'}.png`}
                  alt={item.weather?.[0]?.description || 'Weather icon'}
                  width="34"
                  height="34"
                />
                <span className="fw-semibold">{Math.round(item.main?.temp || 0)} C</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ForecastDisplay;
