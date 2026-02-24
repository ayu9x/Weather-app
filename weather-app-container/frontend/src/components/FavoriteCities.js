import React from 'react';

const FavoriteCities = ({ favorites, onSelectCity, onRemove }) => (
  <div className="favorite-cities glass-card animate-in">
    <h3 className="section-title">⭐ Favorite Cities</h3>
    <div className="favorites-list">
      {favorites.map((city, i) => (
        <div key={i} className="favorite-item">
          <button
            className="favorite-city-btn"
            onClick={() => onSelectCity(city)}
          >
            {city}
          </button>
          <button
            className="favorite-remove-btn"
            onClick={() => onRemove(city)}
            title="Remove from favorites"
            aria-label={`Remove ${city}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default FavoriteCities;
