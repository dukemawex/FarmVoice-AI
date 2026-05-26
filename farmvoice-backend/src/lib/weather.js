const axios = require('axios');
const { getEnv } = require('./env');

async function fetchWeatherByCoords(lat, lng) {
  const apiKey = getEnv('OPENWEATHERMAP_API_KEY');
  if (!apiKey) {
    return {
      location: { lat, lng },
      current: { temp_c: 28, summary: 'Partly cloudy', rain_probability: 20 },
      daily: []
    };
  }

  const { data } = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
    params: {
      lat,
      lon: lng,
      exclude: 'minutely,hourly,alerts',
      units: 'metric',
      appid: apiKey
    },
    timeout: 15000
  });

  const current = {
    temp_c: Math.round(data.current?.temp ?? 0),
    summary: data.current?.weather?.[0]?.description || 'Unknown',
    rain_probability: Math.round((data.daily?.[0]?.pop || 0) * 100)
  };

  const daily = (data.daily || []).slice(0, 7).map((day) => ({
    date: new Date(day.dt * 1000).toISOString().slice(0, 10),
    min_c: Math.round(day.temp?.min ?? 0),
    max_c: Math.round(day.temp?.max ?? 0),
    rain_probability: Math.round((day.pop || 0) * 100),
    summary: day.weather?.[0]?.description || ''
  }));

  return { location: { lat, lng }, current, daily };
}

module.exports = { fetchWeatherByCoords };