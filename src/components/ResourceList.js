import React, { useEffect, useState } from 'react';
import { fetchPlaces } from '../services/googlePlaces';

const ResourceList = ({ zip, category, searchTrigger, selectedPlaceId, onSelect }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to open Google Maps directions
    const openGoogleMapsDirections = (place, event) => {
        // Prevent the click from also selecting the item
        event.stopPropagation();
        
        // Create Google Maps URL with place name and address
        const destination = encodeURIComponent(`${place.name}, ${place.address}`);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${place.place_id}`;
        
        // Open in new window/tab
        window.open(googleMapsUrl, '_blank');
    };

    useEffect(() => {
      if (!zip || !category || !searchTrigger) return;

      (async () => {
        setLoading(true);
        setError('');
        try {
          console.log('Fetching places for:', { zip, category });
          const places = await fetchPlaces(zip, category);
          console.log('Got places:', places);
          
          if (places && places.length > 0) {
            // Use places directly for testing
            setResources(places.slice(0, 15)); // Limit to 15 results
          } else {
            setResources([]);
            setError('No community services found in this area');
          }
        } catch (err) {
          console.error('Error fetching resources:', err);
          setError('Failed to fetch resources. Please try again.');
          setResources([]);
        } finally {
          setLoading(false);
        }
      })();
    }, [zip, category, searchTrigger]);

    if (loading) {
      return (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Community services around you</h2>
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded shadow p-4 flex flex-col overflow-auto h-full">
        <h2 className="text-lg font-semibold mb-2">Community services around you</h2>
        
        {error && (
          <div className="text-red-600 mb-2">{error}</div>
        )}
        
        {resources.length === 0 && !error && (
          <p className="text-gray-500">Enter a ZIP code, select a category, and click Search to find community services.</p>
        )}
        
        {resources.map(res => (
          <div
            key={res.place_id}
            onClick={() => onSelect(res.place_id)}
            className={`mb-3 p-2 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedPlaceId === res.place_id ? 'bg-blue-100' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold">{res.name}</p>
                <p className="text-sm text-gray-600">{res.address}</p>
                {res.rating && (
                  <p className="text-xs text-yellow-600">
                    ⭐ {res.rating}/5
                    {res.distance && (
                      <>{' '}• {res.distance}</>
                    )}
                  </p>
                )}
                {res.reason && <p className="text-xs italic text-blue-600">{res.reason}</p>}
              </div>
              <button
                onClick={(e) => openGoogleMapsDirections(res, e)}
                className="ml-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                title="Get directions"
              >
                📍 Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
export default ResourceList;