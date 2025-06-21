
import React, { useState } from 'react';
import ZipInput from './components/ZipInput';
import CategoryButtons from './components/CategoryButtons';
import MapView from './components/MapView';
import ResourceList from './components/ResourceList';

const App = () => {
  const [zip, setZip] = useState('');
  const [category, setCategory] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">🌉 AidWay - Find Help Around You</h1>
      <ZipInput zip={zip} setZip={setZip} />
      <CategoryButtons setCategory={setCategory} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <MapView zip={zip} category={category} />
        <ResourceList zip={zip} category={category} />
      </div>
    </div>
  );
};

export default App;
