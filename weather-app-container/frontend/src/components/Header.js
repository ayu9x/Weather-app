import React from 'react';

const Header = ({ theme, setTheme, units, setUnits }) => (
  <header className="app-header">
    <div className="header-brand">
      <span className="header-logo" role="img" aria-label="globe">🌍</span>
      <h1 className="header-title">WeatherScope</h1>
    </div>

    <div className="header-controls">
      {/* Unit toggle */}
      <div className="unit-toggle" role="radiogroup" aria-label="Temperature unit">
        <button
          className={`unit-btn ${units === 'metric' ? 'active' : ''}`}
          onClick={() => setUnits('metric')}
          aria-pressed={units === 'metric'}
        >
          °C
        </button>
        <button
          className={`unit-btn ${units === 'imperial' ? 'active' : ''}`}
          onClick={() => setUnits('imperial')}
          aria-pressed={units === 'imperial'}
        >
          °F
        </button>
      </div>

      {/* Theme toggle */}
      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  </header>
);

export default Header;
