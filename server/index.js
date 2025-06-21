require('dotenv').config(path: '.../.env');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Add this dependency
const app = express();
const PORT = process.env.PORT || 58080;

// Enable CORS for your React frontend
app.use(cors({
  origin: 'http://localhost:3000' // React dev server port
}));

app.use(express.json());

app.get('/api/places', async (req, res) => {
    try {
        const { zip, category } = req.query;
        const googleKey = process.env.REACT_APP_GOOGLE_KEY;

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
            food: 'food bank OR soup kitchen OR free food',
            water: 'free drinking water OR water fountain',
            'free wi-fi': 'free WiFi OR public WiFi',
            shelters: 'homeless shelter OR emergency shelter',
            healthcare: 'community health clinic OR free clinic',
            showers: 'public showers OR community center',
            jobs: 'employment services OR job center'
        };

        const query = encodeURIComponent(queryMap[category] || category);

        // Search for places
        const placeRes = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lng}&radius=5000&query=${query}&key=${googleKey}`);
        const places = await placeRes.json();

        if (places.status !== 'OK') {
            return res.status(500).json({ error: 'Google Places API error', details: places.status });
        }

        // Format the response
        const formattedPlaces = places.results.map(place => ({
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            place_id: place.place_id,
            geometry: place.geometry,
            opening_hours: place.opening_hours,
            photos: place.photos
        }));

        res.json(formattedPlaces);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove the duplicate app.listen() - keep only this one
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Make sure your React app calls http://localhost:${PORT}/api/places`);
});