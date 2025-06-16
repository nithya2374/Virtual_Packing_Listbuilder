import ChecklistSection from "./ChecklistSection";

export default function PackingList({ items }) {
  const handleToggle = (cat, idx) => {
    console.log(`Toggled ${items[cat][idx]} in ${cat}`);
  };

  return (
    <div className="p-4">
      {/* Title at the center top */}
      <h1 className="text-3xl font-bold text-center mb-6">My Packing List 🧳</h1>

      {/* Subheading */}
      <h2 className="text-2xl font-bold mb-4">Packing Checklist</h2>

      {/* Checklist Items */}
      {Object.entries(items).map(([category, things]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            {category} 🗂️
          </h3>
          <ul className="pl-4 space-y-1">
            {things.map((item, index) => (
              <li key={index}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => handleToggle(category, index)}
                    className="form-checkbox"
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}