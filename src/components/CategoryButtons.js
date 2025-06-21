import React from 'react';

const categories = [
  { label: 'Food', value: 'food' },
  { label: 'Water', value: 'water' },
  { label: 'Free Wi-Fi', value: 'free wi-fi' },
  { label: 'Shelters', value: 'shelters' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Showers', value: 'showers' },
  { label: 'Jobs', value: 'jobs' }
];

const CategoryButtons = ({ setCategory, selectedCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`px-3 py-2 rounded transition-colors ${
            selectedCategory === cat.value
              ? 'bg-green-600 text-white'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          Nearby {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryButtons;