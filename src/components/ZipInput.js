import React from 'react';

const ZipInput = ({ zip, setZip, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (zip.length === 5 && /^\d{5}$/.test(zip)) {
      onSearch();
    } else {
      alert('Please enter a valid 5-digit ZIP code');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mb-4">
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Enter ZIP Code"
        className="border p-2 rounded-l-md w-40"
        maxLength={5}
        pattern="\d{5}"
      />
      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default ZipInput;