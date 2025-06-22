import React, { useState, useEffect } from 'react';
import ZipInput from './components/ZipInput';
import CategoryButtons from './components/CategoryButtons';
import MapView from './components/MapView';
import ResourceList from './components/ResourceList';
import Chatbot from './components/Chatbot';

const App = () => {
  const [zip, setZip] = useState('');
  const [category, setCategory] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [center, setCenter] = useState(null);
  const [places, setPlaces] = useState([]);

  // Triggered by clicking Search button
  const handleSearch = () => {
    if (!zip) {
      alert('Please enter a ZIP code');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }
    setSearchTrigger(prev => prev + 1);
  };

  // Geocode for map center; does NOT affect ResourceList fetching
  useEffect(() => {
    if (searchTrigger === 0) return;
    (async () => {
      // Fetch resource list for map
      try {
        const placesRes = await fetch(
          `http://localhost:58080/api/places?zip=${zip}&category=${category}`
        );
        const placesData = await placesRes.json();
        setPlaces(placesData);
      } catch (err) {
        console.error('Error fetching places:', err);
        setPlaces([]);
      }

      try {
        const geoRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
        );
        const geoData = await geoRes.json();
        const loc = geoData.results?.[0]?.geometry?.location;
        if (loc) setCenter({ lat: loc.lat, lng: loc.lng });
        else setCenter(null);
      } catch (err) {
        console.error('Error geocoding ZIP:', err);
        setCenter(null);
      }
    })();
  }, [searchTrigger, zip, category]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        🌉 Bridge - Find Help Around You
      </h1>

      <ZipInput zip={zip} setZip={setZip} onSearch={handleSearch} />
      <CategoryButtons
        selectedCategory={category}
        setCategory={setCategory}
      />

      {zip && category && (
        <div className="text-center mb-4 text-gray-600">
          Searching for <strong>{category}</strong> near <strong>{zip}</strong>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Left: resource list (handles its own fetch) */}
        <div className="bg-white rounded shadow overflow-y-auto h-[400px]">
          <ResourceList
            zip={zip}
            category={category}
            searchTrigger={searchTrigger}
            selectedPlaceId={selectedPlaceId}
            onSelect={setSelectedPlaceId}
          />
        </div>

        {/* Right: map view (only uses geocode results) */}
        <div className="bg-white rounded shadow h-[400px]">
          <MapView
            center={center}
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelect={setSelectedPlaceId}
          />
        </div>
        
        {/* Bottom half: Claude-powered chat */}
        <div className="h-[35vh] md:col-span-2 bg-white rounded shadow">
          <Chatbot />
        </div>

      </div>
      <footer className="mt-4 mb-4 text-center text-sm text-gray-500 bg-gray-50 py-2">
        Built for <a href="https://ai.hackberkeley.org/" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">UC Berkeley AI Hackathon</a> 2025.<br />
        View on <a href="https://github.com/minggangli1030/bridge-hackathon-2025" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">GitHub</a> & 
        <a href="https://devpost.com/software/bridge-h3pina" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer"> Devpost</a>. 
        Author: <a href="https://minggangli1030.github.io/" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Minggang (Martin) Li</a>.
      </footer>
    </div>
  );
};

export default App;