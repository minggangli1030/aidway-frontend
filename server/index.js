require('dotenv').config();
console.log('🔑 Google key loaded:', process.env.REACT_APP_GOOGLE_API_KEY ? '✅' : '❌ missing');
console.log('🔑 Antropic key loaded:', process.env.REACT_APP_ANTHROPIC_API_KEY ? '✅' : '❌ missing');
const express = require('express');

// Node 18+: native fetch is available
const cors = require('cors'); // Add this dependency
const app = express();
const PORT = 58080;

// Convert degrees to radians
const toRad = deg => deg * Math.PI / 180;

// Haversine formula to compute distance between two coords in km
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // returns distance in km
}

// Enable CORS for your React frontend
app.use(cors({
  origin: 'http://localhost:3000' // React dev server port
}));

app.use(express.json());

app.get('/api/places', async (req, res) => {
    try {
        const { zip, category } = req.query;
        const googleKey = process.env.REACT_APP_GOOGLE_API_KEY;

        if (!googleKey) {
            return res.status(500).json({ error: 'Google API key not configured' });
        }

        if (!zip || !category) {
            return res.status(400).json({ error: 'ZIP code and category are required' });
        }

        // Get coordinates from ZIP code
        const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${googleKey}`);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ error: 'Invalid ZIP code' });
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        // Map categories to search queries
        const queryMap = {
            food: 'food bank|soup kitchen|food pantry|free meals',
            water: 'drinking water|free water fountain|public water station',
            'free wi-fi': 'free wifi|public wi-fi|community wifi hotspot|public library|community center',
            shelters: 'homeless shelter|emergency shelter|temporary housing',
            healthcare: 'community health clinic|free clinic|medical assistance',
            showers: 'public showers|community showers|shower facility|public restroom|community restroom|public bathroom',
            jobs: 'employment services|job center|career counseling|workforce development'
        };

        const query = encodeURIComponent(queryMap[category] || category);

        // Search for places
        const placeRes = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=${query}&key=${googleKey}`);
        const places = await placeRes.json();

        if (places.status !== 'OK') {
            return res.status(500).json({ error: 'Google Places API error', details: places.status });
        }

        // Format the response
        const formattedPlaces = places.results.map(place => {
            // compute km, then miles, then format as string
            const distKm = haversineDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
            const distMiles = distKm * 0.621371;
            return {
                name: place.name,
                address: place.vicinity || place.formatted_address,
                // Ensure rating is always defined
                rating: place.rating !== undefined ? place.rating : 'No rating',
                place_id: place.place_id,
                geometry: place.geometry,
                opening_hours: place.opening_hours,
                photos: place.photos,
                // Format distance as string with one decimal place
                distance: `${distMiles.toFixed(1)} mi`
            };
        });

        res.json(formattedPlaces);
    } catch (error) {
        console.error('🔥 GooglePlaces Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// ✅ Anthropic proxy: forwards chat requests to Anthropic API
app.post('/api/chat', async (req, res) => {
  try {
    console.log('📥 Received chat request:', req.body);

    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing API key' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: req.body.messages
      }),
    });

    const data = await response.json(); // ✅ READ ONCE
    console.log('✅ Claude response:', data);
    res.json(data);

  } catch (err) {
    console.error('🔥 Anthropic proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Make sure your React app calls http://localhost:${PORT}/api/places`);
});