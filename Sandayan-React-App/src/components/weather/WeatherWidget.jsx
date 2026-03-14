import { useCallback, useEffect, useState } from 'react';
import weatherApi from '../../services/weatherApi';
import { hasWeatherApiKey, WEATHER_KEY_MISSING_MESSAGE } from '../../services/weatherApi';
import ForecastDisplay from './ForecastDisplay';
import LoadingSpinner from '../common/LoadingSpinner';

const WEATHER_KEY_HELP_MESSAGE = `${WEATHER_KEY_MISSING_MESSAGE} Example: VITE_WEATHER_API_KEY=your_api_key_here`;

function WeatherWidget() {
  const keyAvailable = hasWeatherApiKey();
  const [query, setQuery] = useState('Manila');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(keyAvailable);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [error, setError] = useState(keyAvailable ? '' : WEATHER_KEY_HELP_MESSAGE);

  const loadCityWeather = useCallback(async (cityName) => {
    if (!hasWeatherApiKey()) {
      console.warn('[WeatherWidget] City weather request blocked: API key missing');
      setError(WEATHER_KEY_HELP_MESSAGE);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [currentWeather, forecastData] = await Promise.all([
        weatherApi.getCurrentByCity(cityName),
        weatherApi.getForecastByCity(cityName),
      ]);

      setCurrent(currentWeather);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message || 'Unable to load weather details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadGeoWeather = () => {
    if (!hasWeatherApiKey()) {
      console.warn('[WeatherWidget] Geolocation weather request blocked: API key missing');
      setError(WEATHER_KEY_HELP_MESSAGE);
      return;
    }

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
          setQuery(currentWeather.name || 'Manila');
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
    console.info(`[WeatherWidget] API key available: ${keyAvailable}`);

    if (!keyAvailable) {
      return;
    }

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
    <section className="glass-panel h-full p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-cyan-100">Weather Nexus</h2>
          <p className="mt-1 text-xs text-slate-400">OpenWeatherMap live conditions</p>
        </div>
          <button
            type="button"
            className="rounded-lg border border-cyan-200/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-50 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={loadGeoWeather}
            disabled={isGeoLoading || !keyAvailable}
          >
            {isGeoLoading ? 'Locating...' : 'Use My Location'}
          </button>
      </div>

      <form className="mb-3 flex gap-2" onSubmit={handleSubmit}>
          <input
            className="input-glow w-full rounded-lg border border-cyan-200/25 bg-slate-900/35 px-3 py-2 text-sm text-white outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city"
            disabled={!keyAvailable}
          />
          <button type="submit" className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50" disabled={!keyAvailable}>Search</button>
      </form>

      {error && <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">{error}</div>}

      {isLoading ? (
        <LoadingSpinner message="Fetching weather..." />
      ) : (
        <>
          {current && (
            <div className="glass-panel-soft mt-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-300">{current.name}</p>
                  <p className="mt-1 text-4xl font-bold text-neon">{Math.round(current.main?.temp || 0)} C</p>
                  <p className="text-xs capitalize text-slate-300">{current.weather?.[0]?.description || 'Clear sky'}</p>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${current.weather?.[0]?.icon || '01d'}@2x.png`}
                  alt={current.weather?.[0]?.description || 'Weather icon'}
                  width="72"
                  height="72"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <p>Humidity: {current.main?.humidity || '--'}%</p>
                <p>Wind: {Math.round(current.wind?.speed || 0)} m/s</p>
              </div>
            </div>
          )}

          <h3 className="mt-4 text-sm font-semibold text-cyan-100">5-Day Forecast</h3>
          <ForecastDisplay items={forecast} />
        </>
      )}
    </section>
  );
}

export default WeatherWidget;
