import React from 'react';
import { formatTemperature, formatTime } from '../utils/helpers';

const CurrentWeather = ({ weather, units, isFavorite, onToggleFavorite }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="current-weather glass-card animate-in">
      {/* -------- Header -------- */}
      <div className="current-weather-header">
        <div className="current-location">
          <h2 className="city-name">
            {weather.city}, {weather.country}
            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </h2>
          <p className="current-date">{dateStr}</p>
        </div>
      </div>

      {/* -------- Body -------- */}
      <div className="current-weather-body">
        <div className="current-temp-section">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="current-weather-icon"
          />
          <div className="current-temp-info">
            <span className="current-temp">
              {formatTemperature(weather.temperature, units)}
            </span>
            <span className="current-description">{weather.description}</span>
          </div>
        </div>

        <div className="current-temp-range">
          <span className="temp-high">
            ↑ {formatTemperature(weather.temp_max, units)}
          </span>
          <span className="temp-low">
            ↓ {formatTemperature(weather.temp_min, units)}
          </span>
          <span className="feels-like">
            Feels like {formatTemperature(weather.feels_like, units)}
          </span>
        </div>
      </div>

      {/* -------- Footer -------- */}
      <div className="current-weather-footer">
        <div className="sun-times">
          <span>🌅 {formatTime(weather.sunrise, weather.timezone)}</span>
          <span>🌇 {formatTime(weather.sunset, weather.timezone)}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
