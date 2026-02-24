/* ------------------------------------------------------------------ */
/*  Weather background gradients based on condition + day/night       */
/* ------------------------------------------------------------------ */
export const getWeatherBackground = (weatherMain, icon) => {
  const isNight = icon?.includes('n');

  if (isNight) {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)';
      case 'rain':
      case 'drizzle':
        return 'linear-gradient(135deg, #16222A 0%, #3A6073 100%)';
      case 'thunderstorm':
        return 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)';
      default:
        return 'linear-gradient(135deg, #141E30 0%, #243B55 100%)';
    }
  }

  switch (weatherMain?.toLowerCase()) {
    case 'clear':
      return 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)';
    case 'clouds':
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    case 'rain':
    case 'drizzle':
      return 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)';
    case 'thunderstorm':
      return 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)';
    case 'snow':
      return 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)';
    case 'mist':
    case 'fog':
    case 'haze':
    case 'smoke':
      return 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)';
    default:
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }
};

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */
export const formatTemperature = (temp, unit) => {
  const symbol = unit === 'metric' ? 'C' : unit === 'imperial' ? 'F' : 'K';
  return `${Math.round(temp)}°${symbol}`;
};

export const formatTime = (timestamp, timezone) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
};

export const formatDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) return 'Today';

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatHour = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
};

export const getWindDirection = (deg) => {
  const dirs = [
    'N','NNE','NE','ENE','E','ESE','SE','SSE',
    'S','SSW','SW','WSW','W','WNW','NW','NNW',
  ];
  return dirs[Math.round(deg / 22.5) % 16];
};

export const getAQILabel = (aqi) =>
  ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][aqi] || 'Unknown';

export const getAQIColor = (aqi) =>
  ['', '#4CAF50', '#8BC34A', '#FF9800', '#FF5722', '#9C27B0'][aqi] || '#999';

export const getVisibility = (meters) =>
  meters >= 10000 ? '10+ km' : `${(meters / 1000).toFixed(1)} km`;
