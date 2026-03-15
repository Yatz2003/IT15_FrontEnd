import { api, apiPath, withRetry } from './api';

const WEATHER_ENDPOINT = apiPath('/weather');
const FORECAST_DAYS = 7;

const DEFAULT_LOCATION = {
  lat: 14.5995,
  lon: 120.9842,
  city: 'Manila',
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURLY_TIMES = ['09:00', '12:00', '15:00', '18:00'];
const PRESENTABLE_STATUSES = ['Sunny', 'Cloudy', 'Rainy', 'Partly cloudy', 'Windy', 'Cloudy', 'Sunny'];

const ICON_DESCRIPTION_MAP = {
  '01d': 'Sunny',
  '01n': 'Clear night',
  '02d': 'Partly cloudy',
  '02n': 'Partly cloudy',
  '03d': 'Cloudy',
  '03n': 'Cloudy',
  '04d': 'Overcast',
  '04n': 'Overcast',
  '09d': 'Showers',
  '09n': 'Showers',
  '10d': 'Rainy',
  '10n': 'Rainy',
  '11d': 'Thunderstorm',
  '11n': 'Thunderstorm',
  '13d': 'Snow',
  '13n': 'Snow',
  '50d': 'Misty',
  '50n': 'Misty',
};

const MAIN_DESCRIPTION_MAP = {
  Thunderstorm: 'Thunderstorm',
  Drizzle: 'Light rain',
  Rain: 'Rainy',
  Snow: 'Snow',
  Atmosphere: 'Misty',
  Clear: 'Sunny',
  Clouds: 'Cloudy',
};

const normalizeDescription = (description, icon, main) => {
  const normalizedDescription = String(description || '').trim();
  if (normalizedDescription && normalizedDescription.toLowerCase() !== 'partly cloudy') {
    return normalizedDescription;
  }

  const iconLabel = ICON_DESCRIPTION_MAP[String(icon || '').trim()];
  if (iconLabel) {
    return iconLabel;
  }

  const mainLabel = MAIN_DESCRIPTION_MAP[String(main || '').trim()];
  if (mainLabel) {
    return mainLabel;
  }

  return normalizedDescription || 'Cloudy';
};

const normalizeTimestamp = (value, fallbackDate) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1e12 ? Math.floor(value / 1000) : Math.floor(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return Math.floor(fallbackDate.getTime() / 1000);
    }

    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      return numeric > 1e12 ? Math.floor(numeric / 1000) : Math.floor(numeric);
    }

    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) {
      return Math.floor(parsed / 1000);
    }
  }

  return Math.floor(fallbackDate.getTime() / 1000);
};

const normalizeDayLabel = (entry = {}, timestamp) => {
  const explicitDay = String(entry.day || entry.weekday || entry.day_name || '').trim();
  if (explicitDay) {
    return explicitDay.slice(0, 3);
  }

  const date = new Date(timestamp * 1000);
  return WEEK_DAYS[date.getDay()];
};

const mapForecastEntry = (entry = {}, index = 0) => {
  const fallbackDate = new Date();
  fallbackDate.setHours(12, 0, 0, 0);
  fallbackDate.setDate(fallbackDate.getDate() + index);

  const dt = normalizeTimestamp(entry.dt ?? entry.timestamp ?? entry.date, fallbackDate);

  const baseTemp = Number(entry.main?.temp ?? entry.temp?.day ?? entry.temperature ?? 0);
  const hourlyFromEntry = Array.isArray(entry.hourly)
    ? entry.hourly.map((hour, hourIndex) => ({
      time: String(hour.time || hour.hour || HOURLY_TIMES[hourIndex % HOURLY_TIMES.length]),
      temp: Number(hour.temp ?? hour.temperature ?? baseTemp),
    }))
    : [];

  return {
    dt,
    temp: baseTemp,
    description: normalizeDescription(
      entry.weather?.[0]?.description || entry.description,
      entry.weather?.[0]?.icon || entry.icon,
      entry.weather?.[0]?.main || entry.main
    ),
    icon: entry.weather?.[0]?.icon || entry.icon || '01d',
    day: normalizeDayLabel(entry, dt),
    hourly: hourlyFromEntry,
  };
};

const ensureHourlyData = (forecast = []) => forecast.map((entry, index) => {
  if (Array.isArray(entry.hourly) && entry.hourly.length) {
    return entry;
  }

  const temp = Number(entry.temp ?? 0);
  const spread = [-1, 1, 2, 0];
  const hourly = HOURLY_TIMES.map((time, hourIndex) => ({
    time,
    temp: Math.round((temp + spread[hourIndex % spread.length]) * 10) / 10,
  }));

  return {
    ...entry,
    hourly,
    day: entry.day || WEEK_DAYS[(new Date().getDay() + index) % WEEK_DAYS.length],
  };
});

const mapWeatherError = (error) => {
  if (!error.response) {
    return new Error('Network error while fetching weather. Check that the Laravel API server is running and reachable.');
  }

  if (error.code === 'ECONNABORTED') {
    return new Error('Weather service timed out. Please try again.');
  }

  if (error.response?.status === 404) {
    return new Error('Weather data is currently unavailable for this location.');
  }

  if (error.response?.status >= 500) {
    return new Error('Weather service is temporarily unavailable. Please try again later.');
  }

  if (error.response?.status >= 400) {
    return new Error(error.response?.data?.message || 'Unable to fetch weather from the server.');
  }

  return new Error(error.message || 'Unable to fetch weather from the server.');
};

const normalizeWeatherResponse = (payload = {}) => {
  const source = payload?.data || payload;
  const rawLocation = source.location || source.location_name || source.city || source.name || '';
  const normalizedLocation = String(rawLocation).split(',')[0].trim() || DEFAULT_LOCATION.city;

  return {
    name: normalizedLocation,
    main: {
      temp: Number(source.main?.temp ?? source.temperature ?? 0),
      humidity: Number(source.main?.humidity ?? source.humidity ?? 0),
    },
    wind: {
      speed: Number(source.wind?.speed ?? source.wind_speed ?? 0),
    },
    weather: [
      {
        description: normalizeDescription(
          source.weather?.[0]?.description || source.description,
          source.weather?.[0]?.icon || source.icon,
          source.weather?.[0]?.main || source.main_condition
        ),
        icon: source.weather?.[0]?.icon || source.icon || '01d',
      },
    ],
  };
};

const toDailyForecastFromList = (list = []) => {
  const byDay = new Map();

  list.forEach((entry, index) => {
    const mapped = mapForecastEntry(entry, index);
    const date = new Date(mapped.dt * 1000);
    const dayKey = date.toISOString().slice(0, 10);

    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, mapped);
    }
  });

  return Array.from(byDay.values()).slice(0, FORECAST_DAYS);
};

const normalizeForecast = (payload = {}) => {
  const source = payload?.data || payload;
  const hourlyByDay = source.hourly_by_day || source.hourlyByDay || null;

  const mergeHourlyByDay = (entries = []) => entries.map((entry) => {
    if (!hourlyByDay || typeof hourlyByDay !== 'object') {
      return entry;
    }

    const dayKey = entry.day || normalizeDayLabel({}, entry.dt);
    const candidate = hourlyByDay[dayKey] || hourlyByDay[String(dayKey).toLowerCase()];

    if (!Array.isArray(candidate)) {
      return entry;
    }

    return {
      ...entry,
      hourly: candidate.map((hour, hourIndex) => ({
        time: String(hour.time || hour.hour || HOURLY_TIMES[hourIndex % HOURLY_TIMES.length]),
        temp: Number(hour.temp ?? hour.temperature ?? entry.temp ?? 0),
      })),
    };
  });

  if (Array.isArray(source.forecast)) {
    return mergeHourlyByDay(source.forecast.slice(0, FORECAST_DAYS).map((entry, index) => mapForecastEntry(entry, index)));
  }

  if (Array.isArray(source.weekly)) {
    return mergeHourlyByDay(source.weekly.slice(0, FORECAST_DAYS).map((entry, index) => mapForecastEntry(entry, index)));
  }

  if (Array.isArray(source.list)) {
    return mergeHourlyByDay(toDailyForecastFromList(source.list));
  }

  if (Array.isArray(source.daily)) {
    return mergeHourlyByDay(source.daily.slice(0, FORECAST_DAYS).map((entry, index) => mapForecastEntry(entry, index)));
  }

  return [];
};

const buildFallbackForecast = (current = {}) => {
  const baseTemp = Number(current.main?.temp ?? 0);
  const baseDescription = current.weather?.[0]?.description || 'Partly cloudy';
  const baseIcon = current.weather?.[0]?.icon || '01d';

  return Array.from({ length: FORECAST_DAYS }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);

    return {
      dt: Math.floor(date.getTime() / 1000),
      temp: baseTemp,
      description: PRESENTABLE_STATUSES[index] || baseDescription,
      icon: baseIcon,
      day: WEEK_DAYS[date.getDay()],
      hourly: HOURLY_TIMES.map((time, hourIndex) => ({
        time,
        temp: Math.round((baseTemp + [-1, 1, 2, 0][hourIndex]) * 10) / 10,
      })),
    };
  });
};

export const weatherApi = {
  async getWeather(params = {}) {
    try {
      const response = await withRetry(
        () => api.get(WEATHER_ENDPOINT, { params }),
        2
      );

      const current = normalizeWeatherResponse(response.data);
      const forecast = ensureHourlyData(normalizeForecast(response.data));

      return {
        current,
        forecast: forecast.length ? forecast : buildFallbackForecast(current),
      };
    } catch (error) {
      throw mapWeatherError(error);
    }
  },

  async getByCoords(lat, lon) {
    return this.getWeather({ lat, lon });
  },

  async getByCity(city) {
    return this.getWeather({ city });
  },

  async getDefaultWeather() {
    return this.getByCoords(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
  },
};

export { DEFAULT_LOCATION };
export default weatherApi;
