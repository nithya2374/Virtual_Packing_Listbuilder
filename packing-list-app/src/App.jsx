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
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center space-y-6">
      {/* ✅ Title */}
      <h1 className="text-4xl font-bold text-center text-blue-800">
        MY PACKING LIST
      </h1>

      {/* ✅ Top Image */}
      <img src={tripImg} alt="Trip" className="w-full max-w-md rounded shadow" />

      {/* ✅ Form */}
      <div className="w-full max-w-md">
        <TripForm onSubmit={handleTripSubmit} />
      </div>

      {/* ✅ Resort Image immediately under the form */}
      <img src={resortImg} alt="Resort" className="w-full max-w-md rounded shadow" />

      {/* ✅ Packing List */}
      {packingItems && (
        <div className="w-full max-w-md">
          <PackingList items={packingItems} />
        </div>
      )}
    </div>
  );
}