
import React from 'react';

const categories = ['Food', 'Water', 'Free Wi-Fi', 'Shelters', 'Healthcare', 'Showers', 'Jobs'];

const CategoryButtons = ({ setCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat.toLowerCase())}
          className="bg-green-500 text-white px-3 py-2 rounded"
        >
          Nearby {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;
