require('dotenv').config();
console.log('🔑 Loaded key =', process.env.REACT_APP_GOOGLE_API_KEY);
const express = require('express');
// Using native global fetch (Node 18+)
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
            food: 'food bank soup kitchen free food',
            water: 'free drinking water water fountain',
            'free wi-fi': 'free wi-fi public wi-fi',
            shelters: 'homeless shelter emergency shelter',
            healthcare: 'community health clinic free clinic',
            showers: 'public showers community center',
            jobs: 'employment services job center'
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
            // compute km, then miles
            const distKm = haversineDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
            const distMiles = distKm * 0.621371;
            return {
                name: place.name,
                address: place.vicinity || place.formatted_address,
                rating: place.rating,
                place_id: place.place_id,
                geometry: place.geometry,
                opening_hours: place.opening_hours,
                photos: place.photos,
                distance: distMiles // numeric miles
            };
        });

        res.json(formattedPlaces);
    } catch (error) {
        console.error('🔥 GooglePlaces Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Remove the duplicate app.listen() - keep only this one
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Make sure your React app calls http://localhost:${PORT}/api/places`);
});