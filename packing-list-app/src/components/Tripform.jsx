import { useState } from 'react';

export default function TripForm({ onSubmit }) { const [tripType, setTripType] = useState('Vacation'); const [duration, setDuration] = useState(3); const [location, setLocation] = useState('');

const handleSubmit = (e) => { e.preventDefault(); onSubmit({ tripType, duration, location }); };

return ( <form
onSubmit={handleSubmit}
className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto space-y-4"
> <h2 className="text-xl font-bold text-center">Create Your Trip</h2>

{/* Trip Type */}
  <label className="block">
    <span className="text-gray-700">Trip Type</span>
    <select
      value={tripType}
      onChange={(e) => setTripType(e.target.value)}
      className="w-full border rounded px-3 py-2 mt-1"
      title="Select trip type"
    >
      <option>Vacation</option>
      <option>Work</option>
      <option>Hiking</option>
      <option>Family</option>
    </select>
  </label>

  {/* Duration */}
  <label className="block">
    <span className="text-gray-700">Duration (days)</span>
    <input
      type="number"
      value={duration}
      min="1"
      onChange={(e) => setDuration(e.target.value)}
      placeholder="e.g. 3"
      className="w-full border rounded px-3 py-2 mt-1"
      title="Enter trip duration"
    />
  </label>

  {/* Location */}
  <label className="block">
    <span className="text-gray-700">Location</span>
    <input
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      placeholder="e.g., Goa"
      className="w-full border rounded px-3 py-2 mt-1"
      title="Enter destination location"
    />
  </label>

  <button
    type="submit"
    className="w-full bg-violet-600 text-white py-2 rounded hover:bg-blue-700 transition"
  >
    Build Packing List
  </button>
</form>

); }