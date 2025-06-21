require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 58080; // Or anything not in use
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get('/places', async (req, res) => {
    const { zip, category } = req.query;
    const googleKey = process.env.REACT_APP_GOOGLE_KEY;

    const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${googleKey}`);
    const geoData = await geoRes.json();
    const { lat, lng } = geoData.results[0].geometry.location;

    const queryMap = {
        food: 'food bank',
        water: 'free drinking water',
        wifi: 'free WiFi',
        shelter: 'homeless shelter',
        healthcare: 'community clinic',
        showers: 'public showers',
        jobs: 'employment services'
    };
    const query = encodeURIComponent(queryMap[category]);

    const placeRes = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lng}&radius=5000&query=${query}&key=${googleKey}`);
    const places = await placeRes.json();

    res.json(places.results);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
