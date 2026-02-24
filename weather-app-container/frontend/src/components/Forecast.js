import React from 'react';
import { formatDay, formatTemperature } from '../utils/helpers';

const Forecast = ({ daily, units }) => (
  <div className="forecast glass-card animate-in">
    <h3 className="section-title">5-Day Forecast</h3>
    <div className="forecast-list">
      {daily.map((day, i) => (
        <div key={i} className="forecast-item">
          <span className="forecast-day">{formatDay(day.dt)}</span>

          <div className="forecast-icon-desc">
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="forecast-icon"
            />
            <span className="forecast-desc">{day.description}</span>
          </div>

          <div className="forecast-temps">
            <span className="forecast-high">
              {formatTemperature(day.temp_max, units)}
            </span>
            <div className="temp-bar">
              <div
                className="temp-bar-fill"
                style={{
                  width: `${Math.min(100, Math.max(25, ((day.temp_max - day.temp_min) / 20) * 100))}%`,
                }}
              />
            </div>
            <span className="forecast-low">
              {formatTemperature(day.temp_min, units)}
            </span>
          </div>

          {day.pop > 0 && (
            <span className="forecast-rain">
              💧 {Math.round(day.pop * 100)}%
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Forecast;
