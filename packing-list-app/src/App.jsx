import { useState, useRef } from 'react';
import tripImg from './assets/trip-image.jpg';
import resortImg from './assets/resort-image.jpg';
import TripForm from './components/Tripform';
import PackingList from './components/PackingList';
import templates from './data/templates';

export default function App() {
  const [packingItems, setPackingItems] = useState(null);
  const packingListRef = useRef(null); // ⬅️ Ref for scroll target

  const handleTripSubmit = ({ tripType, duration, location }) => {
    const base = templates[tripType];
    const items = {};

    for (let [category, things] of Object.entries(base)) {
      items[category] = [...things, ...(duration > 5 ? [`Extra ${category}`] : [])];
    }

    setPackingItems(items);

    // ⬇️ Smooth scroll to Packing List
    setTimeout(() => {
      if (packingListRef.current) {
        packingListRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center space-y-6">
      {/* ✅ Title */}
      <h1 className="text-4xl font-bold text-center text-blue-800">
        MY PACKING LIST
      </h1>

      {/* ✅ Top Image */}
      <img src={tripImg} alt="Trip" className="w-full max-w-md rounded shadow" />

      {/* ✅ Form Section */}
      <div className="w-full max-w-md">
        <TripForm onSubmit={handleTripSubmit} />
      </div>

      {/* ✅ Second Image under form */}
      <img src={resortImg} alt="Resort" className="w-full max-w-md rounded shadow" />

      {/* ✅ Packing List (scroll target) */}
      {packingItems && (
        <div ref={packingListRef} className="w-full max-w-md">
          <PackingList items={packingItems} />
        </div>
      )}
    </div>
  );
}