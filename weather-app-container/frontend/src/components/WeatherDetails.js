import React from 'react';
import { getWindDirection, getVisibility } from '../utils/helpers';

const WeatherDetails = ({ weather, units }) => {
  const details = [
    { label: 'Feels Like', value: `${Math.round(weather.feels_like)}°`, icon: '🌡️' },
    { label: 'Humidity', value: `${weather.humidity}%`, icon: '💧' },
    {
      label: 'Wind',
      value: `${weather.wind_speed} ${units === 'imperial' ? 'mph' : 'm/s'} ${getWindDirection(weather.wind_deg)}`,
      icon: '💨',
    },
    { label: 'Pressure', value: `${weather.pressure} hPa`, icon: '🔵' },
    { label: 'Visibility', value: getVisibility(weather.visibility), icon: '👁️' },
    { label: 'Clouds', value: `${weather.clouds}%`, icon: '☁️' },
  ];

  return (
    <div className="weather-details-grid glass-card animate-in">
      <h3 className="section-title">Weather Details</h3>
      <div className="details-grid">
        {details.map((d, i) => (
          <div key={i} className="detail-card">
            <span className="detail-icon">{d.icon}</span>
            <span className="detail-label">{d.label}</span>
            <span className="detail-value">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;
