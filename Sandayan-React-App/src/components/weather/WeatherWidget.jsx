import { useCallback, useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import weatherApi, { DEFAULT_LOCATION } from '../../services/weatherApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ForecastDisplay from './ForecastDisplay';

const KNOWN_LOCATIONS = ['Manila', 'Quezon City', 'Cebu City', 'Davao City', 'Baguio'];

function WeatherWidget() {
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedKnownLocation, setSelectedKnownLocation] = useState('');
  const [knownLocationOptions, setKnownLocationOptions] = useState(KNOWN_LOCATIONS);

  const addKnownLocation = useCallback((cityName) => {
    const normalized = String(cityName || '').trim();
    if (!normalized) {
      return;
    }

    setKnownLocationOptions((prev) => {
      const next = [normalized, ...prev.filter((entry) => entry.toLowerCase() !== normalized.toLowerCase())];
      return next.slice(0, 10);
    });
  }, []);

  const applyWeather = useCallback((payload) => {
    setCurrent(payload.current || null);
    setForecast(Array.isArray(payload.forecast) ? payload.forecast.slice(0, 5) : []);
    setSelectedDayIndex(0);
  }, []);

  const loadWeatherByCoords = useCallback(async (lat, lon, options = {}) => {
    const { preserveError = false } = options;

    setIsLoading(true);
    if (!preserveError) {
      setError('');
    }

    try {
      const weatherData = await weatherApi.getByCoords(lat, lon);
      applyWeather(weatherData);
      return true;
    } catch (err) {
      setError(err.message || 'Live weather is temporarily unavailable. Showing fallback forecast.');
      setCurrent(null);
      setForecast([]);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [applyWeather]);

  const loadWeatherByCity = useCallback(async (city, options = {}) => {
    const { preserveError = false } = options;

    setIsLoading(true);
    if (!preserveError) {
      setError('');
    }

    try {
      const weatherData = await weatherApi.getByCity(city);
      applyWeather(weatherData);
      const resolvedCity = weatherData.current?.name || city;
      setQuery(resolvedCity);
      addKnownLocation(resolvedCity);
    } catch (err) {
      setError(err.message || 'Live weather is temporarily unavailable. Showing fallback forecast.');
      setCurrent(null);
      setForecast([]);
    } finally {
      setIsLoading(false);
    }
  }, [addKnownLocation, applyWeather]);

  const loadDefaultWeather = useCallback((options = {}) => {
    loadWeatherByCoords(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, options);
  }, [loadWeatherByCoords]);

  const loadGeoWeather = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser. Showing Manila weather instead.');
      loadDefaultWeather({ preserveError: true });
      return;
    }

    setIsGeoLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loadedCurrentLocation = await loadWeatherByCoords(latitude, longitude);

          if (!loadedCurrentLocation) {
            setError('Unable to fetch weather for your location. Showing Manila weather instead.');
            await loadDefaultWeather({ preserveError: true });
            setQuery(DEFAULT_LOCATION.city);
            setSelectedKnownLocation(DEFAULT_LOCATION.city);
            return;
          }

          setSelectedKnownLocation('');
        } catch (err) {
          setError(err.message || 'Unable to fetch weather for your location. Showing Manila weather instead.');
          await loadDefaultWeather({ preserveError: true });
          setQuery(DEFAULT_LOCATION.city);
          setSelectedKnownLocation(DEFAULT_LOCATION.city);
        } finally {
          setIsGeoLoading(false);
        }
      },
      async (geoError) => {
        if (geoError.code === 1) {
          setError('Location permission denied. Showing Manila weather instead.');
        } else {
          setError('Unable to access your location. Showing Manila weather instead.');
        }
        await loadDefaultWeather({ preserveError: true });
        setQuery(DEFAULT_LOCATION.city);
        setSelectedKnownLocation(DEFAULT_LOCATION.city);
        setIsGeoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [loadDefaultWeather, loadWeatherByCoords]);

  useEffect(() => {
    loadGeoWeather();
  }, [loadGeoWeather]);

  const handleSearch = (event) => {
    event.preventDefault();
    const city = query.trim();

    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    loadWeatherByCity(city);
  };

  const handleKnownLocationChange = (event) => {
    const city = event.target.value;

    if (!city) {
      return;
    }

    setSelectedKnownLocation(city);
    setQuery(city);
    loadWeatherByCity(city);
  };

  const selectedForecast = forecast[selectedDayIndex] || null;
  const hourlyData = Array.isArray(selectedForecast?.hourly) ? selectedForecast.hourly : [];
  const hourlyTemps = hourlyData.map((hour) => Number(hour.temp)).filter(Number.isFinite);
  const yAxisMin = hourlyTemps.length ? Math.floor(Math.min(...hourlyTemps) - 1) : 0;
  const yAxisMax = hourlyTemps.length ? Math.ceil(Math.max(...hourlyTemps) + 1) : 10;

  return (
    <section className="glass-panel h-full p-3.5 sm:p-4">
      <div className="mb-2.5 flex items-start justify-between gap-2.5">
        <div>
          <h2 className="text-sm font-semibold text-cyan-100">Weather Nexus</h2>
          <p className="mt-1 text-xs text-slate-400">5-day local weather outlook</p>
        </div>
          <button
            type="button"
            className="rounded-lg border border-cyan-200/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-50 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={loadGeoWeather}
            disabled={isGeoLoading || isLoading}
          >
            {isGeoLoading ? 'Locating...' : 'Current Location'}
          </button>
      </div>

      <form className="mb-2.5 flex gap-2" onSubmit={handleSearch}>
        <div className="relative w-full">
          <input
            className="input-glow w-full rounded-lg border border-cyan-200/25 bg-slate-900/35 px-3 py-2 pr-20 text-sm text-white outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search location"
            disabled={isLoading}
          />
          <select
            className="absolute right-1 top-1/2 h-7 -translate-y-1/2 rounded-md border border-cyan-200/35 bg-slate-900/85 px-1.5 text-[10px] text-cyan-100 outline-none"
            value={selectedKnownLocation}
            onChange={handleKnownLocationChange}
            disabled={isLoading}
            aria-label="Select known location"
            title="Select known location"
          >
            <option value="">Select</option>
            {knownLocationOptions.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        >
          Search
        </button>
      </form>

      {error && <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">{error}</div>}

      {isLoading ? (
        <LoadingSpinner message="Fetching weather..." />
      ) : (
        <>
          {current && (
            <div className="glass-panel-soft weather-overview-grid mt-2.5 p-3">
              <div className="weather-location-card rounded-lg border border-cyan-200/15 bg-slate-900/20 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-300">{current.name}</p>
                    <p className="mt-1 text-[2.15rem] font-bold leading-none text-neon">{Math.round(current.main?.temp || 0)} °C</p>
                    <p className="text-xs capitalize text-slate-300">{current.weather?.[0]?.description || 'Clear sky'}</p>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${current.weather?.[0]?.icon || '01d'}@2x.png`}
                    alt={current.weather?.[0]?.description || 'Weather icon'}
                    width="96"
                    height="96"
                    className="weather-main-icon"
                  />
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                  <p>Humidity: {current.main?.humidity || '--'}%</p>
                  <p>Wind: {Math.round(current.wind?.speed || 0)} m/s</p>
                </div>
              </div>

              <div className="weather-days-wrap rounded-lg border border-cyan-200/15 bg-slate-900/20 p-2.5">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-cyan-100">5-Day Forecast</h3>
                  <p className="text-[11px] text-slate-400">Select a day</p>
                </div>
                <ForecastDisplay items={forecast} selectedIndex={selectedDayIndex} onSelectDay={setSelectedDayIndex} className="mt-0 h-full" />
              </div>
            </div>
          )}

          {selectedForecast && (
            <div key={selectedForecast.dt || selectedDayIndex} className="glass-panel-soft hourly-panel-enter mt-2.5 p-3">
              <p className="text-xs font-semibold text-cyan-100">
                {selectedDayIndex === 0 ? 'Today' : (selectedForecast.day || 'Selected Day')} Hourly Weather
              </p>

              {hourlyData.length ? (
                <>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-slate-300 sm:grid-cols-4">
                    {hourlyData.map((hour) => (
                      <div key={`${selectedForecast.dt}-${hour.time}`} className="hourly-weather-tile rounded-md bg-slate-900/25 px-2 py-1.5">
                        <p>{hour.time}</p>
                        <p className="font-semibold text-cyan-100">{Math.round(hour.temp)}°C</p>
                      </div>
                    ))}
                  </div>

                  <div className="chart-rise mt-2.5" style={{ height: 145 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hourlyData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                        <CartesianGrid stroke="rgba(148, 192, 255, 0.16)" strokeDasharray="3 3" />
                        <XAxis dataKey="time" stroke="rgba(202, 227, 255, 0.85)" tick={{ fontSize: 10 }} />
                        <YAxis
                          stroke="rgba(202, 227, 255, 0.85)"
                          tick={{ fontSize: 10 }}
                          domain={[yAxisMin, yAxisMax]}
                          tickFormatter={(value) => `${value}°C`}
                        />
                        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}°C`} labelFormatter={(label) => `Time: ${label}`} />
                        <Line
                          type="monotone"
                          dataKey="temp"
                          stroke="#22d3ee"
                          strokeWidth={2}
                          dot={{ r: 3, stroke: '#22d3ee', fill: '#0f172a' }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-slate-300">Hourly weather unavailable for this day.</p>
              )}
            </div>
          )}

          {!current && !error && (
            <div className="glass-panel-soft mt-3 p-4 text-xs text-slate-300">Forecast preview unavailable at the moment.</div>
          )}
        </>
      )}
    </section>
  );
}

export default WeatherWidget;
