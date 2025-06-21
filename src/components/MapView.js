
import React from 'react';

const MapView = ({ zip, category }) => {
  return (
    <div className="h-64 bg-white rounded shadow p-4">
      <p className="font-semibold">Map Placeholder</p>
      <p>ZIP: {zip} | Category: {category}</p>
    </div>
  );
};

export default MapView;
