import axios from 'axios';
import { withRetry } from './api';

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherClient = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: 15000,
});

const getApiKey = () => {
  const key = import.meta.env.VITE_WEATHER_API_KEY;
  if (!key) {
    throw new Error('Weather API key is missing. Set VITE_WEATHER_API_KEY in your environment.');
  }
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
  if (error.response?.status === 429) {
    return new Error('Weather API rate limit reached. Please try again in a minute.');
  }

  if (error.response?.status === 404) {
    return new Error('City not found. Please check spelling and try again.');
  }

  return new Error(error.response?.data?.message || error.message || 'Weather request failed.');
};

export const weatherApi = {
  async getCurrentByCity(city) {
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
