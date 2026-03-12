import { useCallback, useEffect, useState } from 'react';
import weatherApi from '../../services/weatherApi';
import ForecastDisplay from './ForecastDisplay';
import LoadingSpinner from '../common/LoadingSpinner';

function WeatherWidget() {
  const [city, setCity] = useState('Manila');
  const [query, setQuery] = useState('Manila');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCityWeather = useCallback(async (cityName) => {
    setIsLoading(true);
    setError('');

    try {
      const [currentWeather, forecastData] = await Promise.all([
        weatherApi.getCurrentByCity(cityName),
        weatherApi.getForecastByCity(cityName),
      ]);

      setCurrent(currentWeather);
      setForecast(forecastData);
      setCity(cityName);
    } catch (err) {
      setError(err.message || 'Unable to load weather details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadGeoWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGeoLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [currentWeather, forecastData] = await Promise.all([
            weatherApi.getCurrentByCoords(latitude, longitude),
            weatherApi.getForecastByCoords(latitude, longitude),
          ]);

          setCurrent(currentWeather);
          setForecast(forecastData);
          setCity(currentWeather.name || city);
          setQuery(currentWeather.name || city);
        } catch (err) {
          setError(err.message || 'Unable to fetch weather for your location.');
        } finally {
          setIsGeoLoading(false);
          setIsLoading(false);
        }
      },
      () => {
        setError('Location access denied. Please use city search instead.');
        setIsGeoLoading(false);
      }
    );
  };

  useEffect(() => {
    loadCityWeather('Manila');
  }, [loadCityWeather]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setError('Please provide a city name.');
      return;
    }

    loadCityWeather(trimmed);
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <h2 className="h6 fw-semibold mb-0">Weather</h2>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={loadGeoWeather}
            disabled={isGeoLoading}
          >
            {isGeoLoading ? 'Locating...' : 'Use My Location'}
          </button>
        </div>

        <form className="input-group mb-3" onSubmit={handleSubmit}>
          <input
            className="form-control"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {error && <div className="alert alert-warning py-2">{error}</div>}

        {isLoading ? (
          <LoadingSpinner message="Fetching weather..." />
        ) : (
          <>
            {current && (
              <div className="weather-current mb-3">
                <div>
                  <p className="small text-muted mb-1">{current.name}</p>
                  <p className="display-6 fw-bold mb-0">{Math.round(current.main?.temp || 0)} C</p>
                </div>
                <div className="text-end">
                  <p className="mb-1">Humidity: {current.main?.humidity || '--'}%</p>
                  <p className="mb-0">Wind: {Math.round(current.wind?.speed || 0)} m/s</p>
                </div>
              </div>
            )}
            <h3 className="h6 fw-semibold mt-3">5-Day Forecast</h3>
            <ForecastDisplay items={forecast} />
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherWidget;
