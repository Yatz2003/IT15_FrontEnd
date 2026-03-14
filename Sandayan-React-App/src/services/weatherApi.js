import axios from 'axios';
import { withRetry } from './api';

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const PLACEHOLDER_KEY = 'REPLACE_WITH_YOUR_OPENWEATHER_KEY';
export const WEATHER_KEY_MISSING_MESSAGE = 'Weather data is unavailable because VITE_WEATHER_API_KEY is not configured. Add it to Sandayan-React-App/.env, then restart the Vite server.';

const weatherClient = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: 15000,
});

const readWeatherApiKey = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  return String(apiKey || '').trim();
};

const maskApiKey = (key) => {
  if (!key) {
    return 'missing';
  }

  if (key.length <= 8) {
    return `${key.slice(0, 2)}***`;
  }

  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

const logApiKeyStatus = (context) => {
  const key = readWeatherApiKey();
  console.info(`[WeatherAPI] ${context} | key loaded: ${Boolean(key)} | key preview: ${maskApiKey(key)}`);
};

export const hasWeatherApiKey = () => {
  const key = readWeatherApiKey();
  return Boolean(key) && key !== PLACEHOLDER_KEY;
};

const getApiKey = () => {
  if (!hasWeatherApiKey()) {
    logApiKeyStatus('Missing API key check failed');
    throw new Error(WEATHER_KEY_MISSING_MESSAGE);
  }

  const key = readWeatherApiKey();
  logApiKeyStatus('API key resolved');
  return key;
};

const buildParams = (params = {}) => ({
  ...params,
  appid: getApiKey(),
  units: 'metric',
});

const normalizeForecast = (list = []) => {
  const daily = [];
  const seenDays = new Set();

  list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const dayKey = date.toISOString().slice(0, 10);

    if (seenDays.has(dayKey)) {
      return;
    }

    seenDays.add(dayKey);
    daily.push(entry);
  });

  return daily.slice(0, 5);
};

const mapWeatherError = (error) => {
  if (error.message === WEATHER_KEY_MISSING_MESSAGE) {
    return error;
  }

  if (error.response?.status === 401) {
    return new Error('Invalid Weather API key. Update VITE_WEATHER_API_KEY in .env, then restart the Vite dev server.');
  }

  if (error.response?.status === 429) {
    return new Error('Weather API rate limit reached. Please try again in a minute.');
  }

  if (error.response?.status === 404) {
    return new Error('City not found. Please check spelling and try again.');
  }

  return new Error(error.response?.data?.message || error.message || 'Weather request failed.');
};

const ensureApiKey = (methodName) => {
  if (!hasWeatherApiKey()) {
    logApiKeyStatus(`${methodName} blocked`);
    throw new Error(WEATHER_KEY_MISSING_MESSAGE);
  }
};

logApiKeyStatus('Weather service initialized');

export const weatherApi = {
  async getCurrentByCity(city) {
    ensureApiKey('getCurrentByCity');

    try {
      const response = await withRetry(
        () => weatherClient.get('/weather', { params: buildParams({ q: city }) }),
        2
      );
      return response.data;
    } catch (error) {
      throw mapWeatherError(error);
    }
  },

  async getForecastByCity(city) {
    ensureApiKey('getForecastByCity');

    try {
      const response = await withRetry(
        () => weatherClient.get('/forecast', { params: buildParams({ q: city }) }),
        2
      );
      return normalizeForecast(response.data?.list || []);
    } catch (error) {
      throw mapWeatherError(error);
    }
  },

  async getCurrentByCoords(lat, lon) {
    ensureApiKey('getCurrentByCoords');

    try {
      const response = await withRetry(
        () => weatherClient.get('/weather', { params: buildParams({ lat, lon }) }),
        2
      );
      return response.data;
    } catch (error) {
      throw mapWeatherError(error);
    }
  },

  async getForecastByCoords(lat, lon) {
    ensureApiKey('getForecastByCoords');

    try {
      const response = await withRetry(
        () => weatherClient.get('/forecast', { params: buildParams({ lat, lon }) }),
        2
      );
      return normalizeForecast(response.data?.list || []);
    } catch (error) {
      throw mapWeatherError(error);
    }
  },
};

export default weatherApi;
