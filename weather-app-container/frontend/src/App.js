import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/weather`, {
        params: { city }
      });
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="text-center mb-4">Weather App</h1>
              
              <form onSubmit={handleSearch}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {weather && (
                <div className="weather-info text-center mt-4">
                  <h2>{weather.city}, {weather.country}</h2>
                  <div className="weather-icon">
                    <img 
                      src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                      alt={weather.description}
                    />
                  </div>
                  <p className="temperature">{Math.round(weather.temperature)}°C</p>
                  <p className="description text-capitalize">{weather.description}</p>
                  <div className="weather-details mt-3">
                    <div className="row">
                      <div className="col">
                        <p><strong>Feels Like:</strong> {Math.round(weather.feels_like)}°C</p>
                      </div>
                      <div className="col">
                        <p><strong>Humidity:</strong> {weather.humidity}%</p>
                      </div>
                      <div className="col">
                        <p><strong>Wind:</strong> {weather.wind_speed} m/s</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;