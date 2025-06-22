import { getWeatherByZip, getWeatherContext } from './weatherService';

export async function buildContext(zip, category, places = []) {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
  const time = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  });
  
  // Get weather data
  const weather = await getWeatherByZip(zip);
  const weatherContext = getWeatherContext(weather);
  
  // Determine time-based context
  let timeContext = '';
  if (hour < 6) {
    timeContext = 'Very early morning - most services closed';
  } else if (hour < 9) {
    timeContext = 'Early morning - some services opening';
  } else if (hour < 17) {
    timeContext = 'Daytime - most services available';
  } else if (hour < 20) {
    timeContext = 'Evening - some services closing soon';
  } else {
    timeContext = 'Night - limited services available';
  }
  
  // Determine urgency based on conditions
  const urgencyFactors = [];
  if (weather && weather.temp < 40) urgencyFactors.push('cold weather');
  if (hour >= 20 || hour < 6) urgencyFactors.push('nighttime');
  if (dayOfWeek === 'Sunday') urgencyFactors.push('Sunday (limited services)');
  
  // Check which places are likely open
  const openPlaces = places.filter(place => {
    if (place.opening_hours?.open_now !== undefined) {
      return place.opening_hours.open_now;
    }
    // Make educated guess based on category and time
    if (category === 'shelters' && hour >= 16) return true; // Shelters often open in evening
    if (category === 'food' && (hour >= 11 && hour <= 13)) return true; // Lunch hours
    if (hour >= 9 && hour <= 17) return true; // Business hours
    return false;
  });
  
  const context = {
    location: {
      zip,
      placesFound: places.length,
      openNow: openPlaces.length
    },
    time: {
      current: time,
      dayOfWeek,
      hour,
      context: timeContext
    },
    weather: weather ? {
      temperature: `${weather.temp}°F`,
      description: weather.description,
      context: weatherContext
    } : null,
    category: {
      searching: category,
      alternatives: getAlternativeCategories(category, hour)
    },
    urgency: urgencyFactors.length > 0 ? {
      level: urgencyFactors.length > 1 ? 'HIGH' : 'MODERATE',
      factors: urgencyFactors
    } : null
  };
  
  return context;
}

function getAlternativeCategories(mainCategory, hour) {
  const alternatives = [];
  
  if (mainCategory === 'food' && (hour < 9 || hour > 17)) {
    alternatives.push('shelters (may provide meals)');
  }
  if (mainCategory === 'shelters' && hour < 16) {
    alternatives.push('day centers', 'libraries');
  }
  if (hour >= 20) {
    alternatives.push('24-hour locations', 'emergency services');
  }
  
  return alternatives;
}

export function formatContextForClaude(context) {
  let prompt = `Current context for helping user:
- Location: ZIP ${context.location.zip}
- Time: ${context.time.current} on ${context.time.dayOfWeek}
- ${context.time.context}`;
  
  if (context.weather) {
    prompt += `\n- Weather: ${context.weather.temperature}, ${context.weather.description}
- ${context.weather.context}`;
  }
  
  if (context.location.placesFound > 0) {
    prompt += `\n- Found ${context.location.placesFound} ${context.category.searching} locations`;
    prompt += `\n- ${context.location.openNow} appear to be open now`;
  }
  
  if (context.urgency) {
    prompt += `\n- URGENCY: ${context.urgency.level} due to ${context.urgency.factors.join(', ')}`;
  }
  
  if (context.category.alternatives.length > 0) {
    prompt += `\n- Consider also: ${context.category.alternatives.join(', ')}`;
  }
  
  prompt += `\n\nPrioritize: immediate needs, safety, currently open locations.`;
  
  return prompt;
}