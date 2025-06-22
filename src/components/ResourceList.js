import React, { useEffect, useState } from 'react';
import { fetchPlaces } from '../services/googlePlaces';

const ResourceList = ({ zip, category, searchTrigger, selectedPlaceId, onSelect }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            setError('No resources found in this area');
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
          <h2 className="text-lg font-semibold mb-2">Resources around you</h2>
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded shadow p-4 flex flex-col overflow-auto h-full">
        <h2 className="text-lg font-semibold mb-2">Resources around you</h2>
        
        {error && (
          <div className="text-red-600 mb-2">{error}</div>
        )}
        
        {resources.length === 0 && !error && (
          <p className="text-gray-500">Enter a ZIP code, select a category, and click Search to find resources.</p>
        )}
        
        {resources.map(res => (
          <div
            key={res.place_id}
            onClick={() => onSelect(res.place_id)}
            className={`mb-3 p-2 border-b cursor-pointer ${selectedPlaceId === res.place_id ? 'bg-blue-100' : ''}`}
          >
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
        ))}
      </div>
    );
  };
  
export default ResourceList;