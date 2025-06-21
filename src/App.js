import React, { useState } from 'react';
import ZipInput from './components/ZipInput';
import CategoryButtons from './components/CategoryButtons';
import MapView from './components/MapView';
import ResourceList from './components/ResourceList';

const App = () => {
  const [zip, setZip] = useState('');
  const [category, setCategory] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0); // Used to trigger new searches

  const handleSearch = () => {
    if (zip && category) {
      setSearchTrigger(prev => prev + 1); // Increment to trigger useEffect in ResourceList
      console.log('Searching for:', { zip, category });
    } else if (!zip) {
      alert('Please enter a ZIP code');
    } else if (!category) {
      alert('Please select a category');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">🌉 Bridge - Find Help Around You</h1>
      
      {/* Pass onSearch prop to ZipInput */}
      <ZipInput zip={zip} setZip={setZip} onSearch={handleSearch} />
      
      {/* Pass selectedCategory to show which is active */}
      <CategoryButtons setCategory={setCategory} selectedCategory={category} />
      
      {/* Show current selection */}
      {zip && category && (
        <div className="text-center mb-4 text-gray-600">
          Searching for <strong>{category}</strong> near <strong>{zip}</strong>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <MapView zip={zip} category={category} />
        <ResourceList zip={zip} category={category} searchTrigger={searchTrigger} />
      </div>
    </div>
  );
};

export default App;