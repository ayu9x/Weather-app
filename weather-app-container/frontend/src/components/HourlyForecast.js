import React from 'react';
import { formatHour, formatTemperature } from '../utils/helpers';

const HourlyForecast = ({ hourly, units }) => (
  <div className="hourly-forecast glass-card animate-in">
    <h3 className="section-title">Hourly Forecast</h3>
    <div className="hourly-scroll">
      {hourly.map((h, i) => (
        <div key={i} className="hourly-item">
          <span className="hourly-time">{i === 0 ? 'Now' : formatHour(h.dt)}</span>
          <img
            src={`https://openweathermap.org/img/wn/${h.icon}.png`}
            alt={h.description}
            className="hourly-icon"
          />
          <span className="hourly-temp">{formatTemperature(h.temp, units)}</span>
          {h.pop > 0 && (
            <span className="hourly-rain">💧{Math.round(h.pop * 100)}%</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default HourlyForecast;
