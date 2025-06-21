import React, { useEffect, useState } from 'react';
import { fetchPlaces } from '../services/googlePlaces';
import { filterWithClaude } from '../services/claudeFilter';

const ResourceList = ({ zip, category }) => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
      if (!zip || !category) return;

      (async () => {
        const places = await fetchPlaces(zip, category);
        const filtered = await filterWithClaude(zip, category, places);
        setResources(filtered);
      })();
    }, [zip, category]);

    return (
      <div className="bg-white rounded shadow p-4 overflow-auto max-h-64">
        <h2 className="text-lg font-semibold mb-2">Resources</h2>
        {resources.map((res, idx) => (
          <div key={idx} className="mb-2">
            <p className="font-bold">{res.name}</p>
            <p className="text-sm">{res.address}</p>
            {res.reason && <p className="text-xs italic">{res.reason}</p>}
          </div>
        ))}
      </div>
    );
  };
  
export default ResourceList;