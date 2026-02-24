import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export const fetchWeather = async (city, units = 'metric') => {
  const { data } = await api.get('/api/weather', { params: { city, units } });
  return data;
};

export const fetchWeatherByCoords = async (lat, lon, units = 'metric') => {
  const { data } = await api.get('/api/weather', { params: { lat, lon, units } });
  return data;
};

export const fetchForecast = async (city, units = 'metric') => {
  const { data } = await api.get('/api/forecast', { params: { city, units } });
  return data;
};

export const fetchForecastByCoords = async (lat, lon, units = 'metric') => {
  const { data } = await api.get('/api/forecast', { params: { lat, lon, units } });
  return data;
};

export const fetchAirQuality = async (lat, lon) => {
  const { data } = await api.get('/api/air-quality', { params: { lat, lon } });
  return data;
};

export const searchCities = async (query) => {
  const { data } = await api.get('/api/search', { params: { q: query } });
  return data;
};

export default api;
