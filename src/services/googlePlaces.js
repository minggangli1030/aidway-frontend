const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_KEY;

/**
 * Fetches places from Google Places API matching a keyword (food bank, shelter, etc.)
 * near the center coordinates of the provided ZIP code.
 */
export async function fetchPlaces(zip, category) {
    // 1) Geocode ZIP to lat/lng
    const geo = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${GOOGLE_KEY}`
    ).then(r => r.json());
    const { lat, lng } = geo.results[0].geometry.location;

    // 2) Map Aidway categories to Google text search keywords
    const keywords = {
        food: 'food bank',
        water: 'public water fountain',
        wifi: 'free wifi',
        shelter: 'homeless shelter',
        healthcare: 'free clinic',
        showers: 'public shower',
        jobs: 'day labor center'
    };

    const search = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        keywords[category]
        )}&location=${lat},${lng}&radius=5000&key=${GOOGLE_KEY}`
    ).then(r => r.json());

    return search.results.map(p => ({
        name: p.name,
        address: p.formatted_address,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        placeId: p.place_id
    }));
}