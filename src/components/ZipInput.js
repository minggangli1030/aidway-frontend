
import React from 'react';

const ZipInput = ({ zip, setZip }) => {
  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Enter ZIP Code"
        className="border p-2 rounded-l-md w-40"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md">Search</button>
    </div>
  );
};

export default ZipInput;
