import React, { useEffect, useState } from 'react';
import { fetchPlaces } from '../services/googlePlaces';
import { filterWithClaude } from '../services/claudeFilter';

const ResourceList = ({ zip, category, searchTrigger }) => {
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
            // For now, skip Claude filtering to test basic functionality
            // const filtered = await filterWithClaude(zip, category, places);
            // setResources(filtered);
            
            // Use places directly for testing
            setResources(places.slice(0, 5)); // Limit to 5 results
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
          <h2 className="text-lg font-semibold mb-2">Resources</h2>
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded shadow p-4 overflow-auto max-h-64">
        <h2 className="text-lg font-semibold mb-2">Resources</h2>
        
        {error && (
          <div className="text-red-600 mb-2">{error}</div>
        )}
        
        {resources.length === 0 && !error && (
          <p className="text-gray-500">Enter a ZIP code, select a category, and click Search to find resources.</p>
        )}
        
        {resources.map((res, idx) => (
          <div key={idx} className="mb-3 p-2 border-b">
            <p className="font-bold">{res.name}</p>
            <p className="text-sm text-gray-600">{res.address}</p>
            {res.rating && (
              <p className="text-xs text-yellow-600">⭐ {res.rating}/5</p>
            )}
            {res.reason && <p className="text-xs italic text-blue-600">{res.reason}</p>}
          </div>
        ))}
      </div>
    );
  };
  
export default ResourceList;