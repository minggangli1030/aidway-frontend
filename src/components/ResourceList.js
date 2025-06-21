
import React from 'react';

const dummyResources = [
  { name: 'Soup Kitchen A', address: '123 Main St', status: 'Open' },
  { name: 'Shelter B', address: '456 Shelter Rd', status: 'Closed' },
];

const ResourceList = ({ zip, category }) => {
  return (
    <div className="bg-white rounded shadow p-4 overflow-auto max-h-64">
      <h2 className="text-lg font-semibold mb-2">Resources</h2>
      {dummyResources.map((res, idx) => (
        <div key={idx} className="mb-2">
          <p className="font-bold">{res.name}</p>
          <p className="text-sm">{res.address} - <span className="text-green-600">{res.status}</span></p>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;
