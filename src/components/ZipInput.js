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
        inputMode="numeric"
        pattern="[0-9]*"
        value={zip}
        onChange={e => setZip(e.target.value.replace(/\D/g, ''))}
        placeholder="Enter ZIP Code"
        className="border p-2 rounded-l-md w-40"
        maxLength={5}
      />
      <button
        type="submit"
        disabled={zip.length !== 5}
        className={`bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 ${
          zip.length !== 5 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Search
      </button>
    </form>
  );
};

export default ZipInput;