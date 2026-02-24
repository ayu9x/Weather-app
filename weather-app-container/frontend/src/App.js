import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import Forecast from './components/Forecast';
import AirQuality from './components/AirQuality';
import FavoriteCities from './components/FavoriteCities';
import LoadingSkeleton from './components/LoadingSkeleton';

// Utilities
import {
  fetchWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
  fetchAirQuality,
  searchCities,
} from './utils/api';
import { getWeatherBackground } from './utils/helpers';

function App() {
  /* ---------------------------------------------------------------- */
  /*  State                                                            */
  /* ---------------------------------------------------------------- */

  // Settings (persisted)
  const [theme, setTheme] = useState(
    () => localStorage.getItem('ws_theme') || 'dark',
  );
  const [units, setUnits] = useState(
    () => localStorage.getItem('ws_units') || 'metric',
  );

  // Weather data
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Favourites & history (persisted)
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem('ws_favorites') || '[]'),
  );
  const [searchHistory, setSearchHistory] = useState(() =>
    JSON.parse(localStorage.getItem('ws_history') || '[]'),
  );

  /* ---------------------------------------------------------------- */
  /*  Persist settings                                                 */
  /* ---------------------------------------------------------------- */
  useEffect(() => localStorage.setItem('ws_theme', theme), [theme]);
  useEffect(() => localStorage.setItem('ws_units', units), [units]);
  useEffect(
    () => localStorage.setItem('ws_favorites', JSON.stringify(favorites)),
    [favorites],
  );
  useEffect(
    () => localStorage.setItem('ws_history', JSON.stringify(searchHistory)),
    [searchHistory],
  );

  // Apply theme class to <html> for global scope
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ---------------------------------------------------------------- */
  /*  Data fetching                                                    */
  /* ---------------------------------------------------------------- */
  const fetchAllData = useCallback(
    async (city, lat, lon) => {
      setLoading(true);
      setError(null);

      try {
        let weatherData, forecastData;

        if (city) {
          [weatherData, forecastData] = await Promise.all([
            fetchWeather(city, units),
            fetchForecast(city, units),
          ]);
        } else {
          [weatherData, forecastData] = await Promise.all([
            fetchWeatherByCoords(lat, lon, units),
            fetchForecastByCoords(lat, lon, units),
          ]);
        }

        setWeather(weatherData);
        setForecast(forecastData);

        // Air quality (non-blocking)
        if (weatherData.coord) {
          fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon)
            .then(setAirQuality)
            .catch(() => setAirQuality(null));
        }

        // Update search history
        if (city) {
          setSearchHistory((prev) => {
            const filtered = prev.filter(
              (h) => h.toLowerCase() !== city.toLowerCase(),
            );
            return [city, ...filtered].slice(0, 10);
          });
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
            'Failed to fetch weather data. Please try again.',
        );
        setWeather(null);
        setForecast(null);
        setAirQuality(null);
      } finally {
        setLoading(false);
      }
    },
    [units],
  );

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */
  const handleSearch = (city) => {
    if (!city?.trim()) return;
    setSearchQuery(city);
    setSuggestions([]);
    fetchAllData(city);
  };

  const handleSearchInput = async (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (s) => {
    setSearchQuery(`${s.name}, ${s.country}`);
    setSuggestions([]);
    fetchAllData(s.name);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchAllData(null, pos.coords.latitude, pos.coords.longitude),
      () => {
        setError('Unable to get your location. Please enable location services.');
        setLoading(false);
      },
    );
  };

  const toggleFavorite = (city) => {
    setFavorites((prev) =>
      prev.includes(city)
        ? prev.filter((f) => f !== city)
        : [...prev, city].slice(0, 8),
    );
  };

  const handleUnitChange = (newUnit) => setUnits(newUnit);

  // Refetch when units change
  useEffect(() => {
    if (weather?.city) fetchAllData(weather.city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  // Auto-detect location on first load
  useEffect(() => {
    handleGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Derived values                                                   */
  /* ---------------------------------------------------------------- */
  const background = weather
    ? getWeatherBackground(weather.main, weather.icon)
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  const isFavorite = weather?.city ? favorites.includes(weather.city) : false;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className={`app ${theme}`} style={{ background }}>
      <div className="app-overlay">
        <Header
          theme={theme}
          setTheme={setTheme}
          units={units}
          setUnits={handleUnitChange}
        />

        <main className="main-content">
          <SearchBar
            query={searchQuery}
            onSearch={handleSearch}
            onInputChange={handleSearchInput}
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            onGeolocation={handleGeolocation}
            searchHistory={searchHistory}
          />

          {/* Error banner */}
          {error && (
            <div className="error-message animate-in" role="alert">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button onClick={() => setError(null)} aria-label="Dismiss">✕</button>
            </div>
          )}

          {/* Loading state */}
          {loading && <LoadingSkeleton />}

          {/* Weather content */}
          {weather && !loading && (
            <div className="weather-content">
              <CurrentWeather
                weather={weather}
                units={units}
                isFavorite={isFavorite}
                onToggleFavorite={() => toggleFavorite(weather.city)}
              />

              <WeatherDetails weather={weather} units={units} />

              {forecast?.hourly && (
                <HourlyForecast hourly={forecast.hourly} units={units} />
              )}

              {forecast?.daily && (
                <Forecast daily={forecast.daily} units={units} />
              )}

              {airQuality && <AirQuality data={airQuality} />}
            </div>
          )}

          {/* Favorite cities */}
          {favorites.length > 0 && (
            <FavoriteCities
              favorites={favorites}
              onSelectCity={handleSearch}
              onRemove={toggleFavorite}
            />
          )}

          {/* Welcome screen */}
          {!weather && !loading && !error && (
            <div className="welcome-message animate-in">
              <div className="welcome-icon">🌤️</div>
              <h2>Welcome to WeatherScope</h2>
              <p>
                Search for a city or allow location access to see current
                weather, forecasts, and air quality.
              </p>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>
            WeatherScope &copy; {new Date().getFullYear()} &mdash; Powered by
            OpenWeatherMap
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;