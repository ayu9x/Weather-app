from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
from datetime import datetime, timezone
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
BASE_URL = "https://api.openweathermap.org/data/2.5"
GEO_URL = "https://api.openweathermap.org/geo/1.0"

# Simple in-memory cache
_cache = {}
CACHE_DURATION = 600  # 10 minutes


def get_cached(key):
    if key in _cache:
        data, timestamp = _cache[key]
        if (datetime.now() - timestamp).total_seconds() < CACHE_DURATION:
            return data
        del _cache[key]
    return None


def set_cache(key, data):
    _cache[key] = (data, datetime.now())


# -------------------------------------------------------------------
# Health Check
# -------------------------------------------------------------------
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    })


# -------------------------------------------------------------------
# Current Weather – supports city name OR lat/lon
# -------------------------------------------------------------------
@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', '')
    lat = request.args.get('lat', '')
    lon = request.args.get('lon', '')
    units = request.args.get('units', 'metric')

    if not city and not (lat and lon):
        return jsonify({"error": "City name or coordinates are required"}), 400

    cache_key = f"weather_{city}_{lat}_{lon}_{units}"
    cached = get_cached(cache_key)
    if cached:
        return jsonify(cached)

    params = {'appid': OPENWEATHER_API_KEY, 'units': units}
    if city:
        params['q'] = city
    else:
        params['lat'] = lat
        params['lon'] = lon

    try:
        response = requests.get(f"{BASE_URL}/weather", params=params)
        data = response.json()

        if response.status_code == 200:
            weather_data = {
                'city': data['name'],
                'country': data['sys']['country'],
                'temperature': data['main']['temp'],
                'temp_min': data['main']['temp_min'],
                'temp_max': data['main']['temp_max'],
                'description': data['weather'][0]['description'],
                'icon': data['weather'][0]['icon'],
                'main': data['weather'][0]['main'],
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'wind_deg': data['wind'].get('deg', 0),
                'feels_like': data['main']['feels_like'],
                'pressure': data['main']['pressure'],
                'visibility': data.get('visibility', 0),
                'clouds': data['clouds']['all'],
                'sunrise': data['sys']['sunrise'],
                'sunset': data['sys']['sunset'],
                'timezone': data['timezone'],
                'coord': {
                    'lat': data['coord']['lat'],
                    'lon': data['coord']['lon']
                },
                'dt': data['dt']
            }
            set_cache(cache_key, weather_data)
            return jsonify(weather_data)
        else:
            return jsonify({"error": data.get('message', 'Unknown error')}), response.status_code

    except Exception as e:
        logger.error(f"Error fetching weather: {e}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------------------
# 5-Day / Hourly Forecast
# -------------------------------------------------------------------
@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    city = request.args.get('city', '')
    lat = request.args.get('lat', '')
    lon = request.args.get('lon', '')
    units = request.args.get('units', 'metric')

    if not city and not (lat and lon):
        return jsonify({"error": "City name or coordinates are required"}), 400

    cache_key = f"forecast_{city}_{lat}_{lon}_{units}"
    cached = get_cached(cache_key)
    if cached:
        return jsonify(cached)

    params = {'appid': OPENWEATHER_API_KEY, 'units': units}
    if city:
        params['q'] = city
    else:
        params['lat'] = lat
        params['lon'] = lon

    try:
        response = requests.get(f"{BASE_URL}/forecast", params=params)
        data = response.json()

        if response.status_code == 200:
            hourly = []
            daily_map = {}

            for item in data['list']:
                # First 8 items ≈ next 24 hours
                if len(hourly) < 8:
                    hourly.append({
                        'dt': item['dt'],
                        'temp': item['main']['temp'],
                        'icon': item['weather'][0]['icon'],
                        'description': item['weather'][0]['description'],
                        'wind_speed': item['wind']['speed'],
                        'humidity': item['main']['humidity'],
                        'pop': item.get('pop', 0)
                    })

                # Aggregate daily min/max
                date_key = datetime.fromtimestamp(item['dt'], tz=timezone.utc).strftime('%Y-%m-%d')
                if date_key not in daily_map:
                    daily_map[date_key] = {
                        'dt': item['dt'],
                        'date': date_key,
                        'temp_min': item['main']['temp_min'],
                        'temp_max': item['main']['temp_max'],
                        'icon': item['weather'][0]['icon'],
                        'description': item['weather'][0]['description'],
                        'main': item['weather'][0]['main'],
                        'humidity': item['main']['humidity'],
                        'wind_speed': item['wind']['speed'],
                        'pop': item.get('pop', 0)
                    }
                else:
                    daily_map[date_key]['temp_min'] = min(
                        daily_map[date_key]['temp_min'], item['main']['temp_min'])
                    daily_map[date_key]['temp_max'] = max(
                        daily_map[date_key]['temp_max'], item['main']['temp_max'])

            daily = list(daily_map.values())[:5]

            forecast_data = {
                'hourly': hourly,
                'daily': daily,
                'city': data['city']['name'],
                'country': data['city']['country']
            }
            set_cache(cache_key, forecast_data)
            return jsonify(forecast_data)
        else:
            return jsonify({"error": data.get('message', 'Unknown error')}), response.status_code

    except Exception as e:
        logger.error(f"Error fetching forecast: {e}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------------------
# Air Quality
# -------------------------------------------------------------------
@app.route('/api/air-quality', methods=['GET'])
def get_air_quality():
    lat = request.args.get('lat', '')
    lon = request.args.get('lon', '')

    if not lat or not lon:
        return jsonify({"error": "Coordinates (lat, lon) are required"}), 400

    cache_key = f"aq_{lat}_{lon}"
    cached = get_cached(cache_key)
    if cached:
        return jsonify(cached)

    try:
        params = {'lat': lat, 'lon': lon, 'appid': OPENWEATHER_API_KEY}
        response = requests.get(f"{BASE_URL}/air_pollution", params=params)
        data = response.json()

        if response.status_code == 200 and data.get('list'):
            aq = data['list'][0]
            result = {
                'aqi': aq['main']['aqi'],
                'components': aq['components']
            }
            set_cache(cache_key, result)
            return jsonify(result)
        else:
            return jsonify({"error": "Could not fetch air quality data"}), 400

    except Exception as e:
        logger.error(f"Error fetching air quality: {e}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------------------
# City Search / Autocomplete (Geocoding)
# -------------------------------------------------------------------
@app.route('/api/search', methods=['GET'])
def search_cities():
    query = request.args.get('q', '')
    if not query or len(query) < 2:
        return jsonify([])

    cache_key = f"search_{query.lower()}"
    cached = get_cached(cache_key)
    if cached:
        return jsonify(cached)

    try:
        params = {'q': query, 'limit': 5, 'appid': OPENWEATHER_API_KEY}
        response = requests.get(f"{GEO_URL}/direct", params=params)
        data = response.json()

        if response.status_code == 200:
            cities = [{
                'name': c['name'],
                'country': c['country'],
                'state': c.get('state', ''),
                'lat': c['lat'],
                'lon': c['lon']
            } for c in data]
            set_cache(cache_key, cities)
            return jsonify(cities)
        return jsonify([])

    except Exception as e:
        logger.error(f"Error searching cities: {e}")
        return jsonify([])


# -------------------------------------------------------------------
# Reverse Geocode
# -------------------------------------------------------------------
@app.route('/api/reverse-geocode', methods=['GET'])
def reverse_geocode():
    lat = request.args.get('lat', '')
    lon = request.args.get('lon', '')

    if not lat or not lon:
        return jsonify({"error": "Coordinates required"}), 400

    try:
        params = {'lat': lat, 'lon': lon, 'limit': 1, 'appid': OPENWEATHER_API_KEY}
        response = requests.get(f"{GEO_URL}/reverse", params=params)
        data = response.json()

        if response.status_code == 200 and data:
            return jsonify({
                'name': data[0]['name'],
                'country': data[0]['country'],
                'state': data[0].get('state', '')
            })
        return jsonify({"error": "Location not found"}), 404

    except Exception as e:
        logger.error(f"Error reverse geocoding: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)