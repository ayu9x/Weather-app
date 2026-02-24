import React from 'react';
import { getAQILabel, getAQIColor } from '../utils/helpers';

const AirQuality = ({ data }) => {
  const { aqi, components } = data;
  const label = getAQILabel(aqi);
  const color = getAQIColor(aqi);

  const pollutants = [
    { name: 'PM2.5', value: components.pm2_5?.toFixed(1), unit: 'μg/m³' },
    { name: 'PM10', value: components.pm10?.toFixed(1), unit: 'μg/m³' },
    { name: 'O₃', value: components.o3?.toFixed(1), unit: 'μg/m³' },
    { name: 'NO₂', value: components.no2?.toFixed(1), unit: 'μg/m³' },
    { name: 'SO₂', value: components.so2?.toFixed(1), unit: 'μg/m³' },
    { name: 'CO', value: components.co?.toFixed(1), unit: 'μg/m³' },
  ];

  return (
    <div className="air-quality glass-card animate-in">
      <h3 className="section-title">Air Quality</h3>

      <div className="aqi-display">
        <div className="aqi-gauge" style={{ borderColor: color }}>
          <span className="aqi-number" style={{ color }}>
            {aqi}
          </span>
          <span className="aqi-label">{label}</span>
        </div>

        <div className="aqi-scale">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`aqi-dot ${level === aqi ? 'active' : ''}`}
              style={{ backgroundColor: getAQIColor(level) }}
              title={getAQILabel(level)}
            />
          ))}
        </div>
      </div>

      <div className="pollutants-grid">
        {pollutants.map((p, i) => (
          <div key={i} className="pollutant-item">
            <span className="pollutant-name">{p.name}</span>
            <span className="pollutant-value">
              {p.value} <small>{p.unit}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQuality;
