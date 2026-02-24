import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({
  query,
  onSearch,
  onInputChange,
  suggestions,
  onSelectSuggestion,
  onGeolocation,
  searchHistory,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  const dropdownRef = useRef(null);

  useEffect(() => setLocalQuery(query), [query]);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowHistory(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
      setShowHistory(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalQuery(val);
    onInputChange(val);
    setShowHistory(val.length === 0 && searchHistory.length > 0);
  };

  const handleFocus = () => {
    if (!localQuery && searchHistory.length > 0) setShowHistory(true);
  };

  return (
    <div className="search-container" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city..."
            value={localQuery}
            onChange={handleChange}
            onFocus={handleFocus}
            autoComplete="off"
          />
          {localQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setLocalQuery('');
                onInputChange('');
              }}
              aria-label="Clear"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-btn" aria-label="Search">
          Search
        </button>
        <button
          type="button"
          className="location-btn"
          onClick={onGeolocation}
          title="Use my location"
          aria-label="Use my location"
        >
          📍
        </button>
      </form>

      {/* City autocomplete */}
      {suggestions.length > 0 && (
        <div className="search-dropdown" role="listbox">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="dropdown-item"
              role="option"
              aria-selected={false}
              onClick={() => {
                onSelectSuggestion(s);
                setShowHistory(false);
              }}
            >
              <span className="dropdown-icon">📍</span>
              <span className="dropdown-text">
                {s.name}
                {s.state ? `, ${s.state}` : ''}, {s.country}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Recent searches */}
      {showHistory && searchHistory.length > 0 && suggestions.length === 0 && (
        <div className="search-dropdown">
          <div className="dropdown-header">Recent Searches</div>
          {searchHistory.map((city, i) => (
            <button
              key={i}
              className="dropdown-item"
              onClick={() => {
                onSearch(city);
                setShowHistory(false);
              }}
            >
              <span className="dropdown-icon">🕐</span>
              <span className="dropdown-text">{city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
