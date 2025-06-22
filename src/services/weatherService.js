// You can use OpenWeatherMap API (free tier available)
// Sign up at https://openweathermap.org/api to get an API key

export async function getWeatherByZip(zip) {
  try {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&appid=${API_KEY}&units=imperial`
    );
    const data = await response.json();
    
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: Math.round(data.wind.speed)
    };
    
    
    return mockWeather;
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

export function getWeatherContext(weather) {
  if (!weather) return '';
  
  const { temp, description } = weather;
  
  if (temp < 32) {
    return 'FREEZING CONDITIONS - Prioritize warm indoor locations and shelters';
  } else if (temp < 50) {
    return 'Cold weather - Indoor locations preferred';
  } else if (temp > 90) {
    return 'Hot weather - Prioritize locations with AC or shade';
  } else if (description.toLowerCase().includes('rain')) {
    return 'Rainy conditions - Indoor locations recommended';
  }
  
  return 'Moderate weather conditions';
}