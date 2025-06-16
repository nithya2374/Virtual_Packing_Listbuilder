import tripImg from './assets/trip-image.jpg';
import resortImg from './assets/resort-image.jpg';
import TripForm from './components/Tripform';
import PackingList from './components/PackingList';
import { useState } from 'react';
import templates from './data/templates';

export default function App() {
  const [packingItems, setPackingItems] = useState(null);

  const handleTripSubmit = ({ tripType, duration, location }) => {
    const base = templates[tripType];
    const items = {};

    for (let [category, things] of Object.entries(base)) {
      items[category] = [...things, ...(duration > 5 ? [`Extra ${category}`] : [])];
    }

    setPackingItems(items);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Images */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <img src={tripImg} alt="Trip" className="w-1/2 rounded" />
        <img src={resortImg} alt="Resort" className="w-1/2 rounded" />
      </div>

      {/* Form + Packing List */}

      <TripForm onSubmit={handleTripSubmit} />
      {packingItems && <PackingList items={packingItems} />}
    </div>
  );
}
console.log('tripImg path:', tripImg);
