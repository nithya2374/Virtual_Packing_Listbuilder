import ChecklistSection from "./ChecklistSection";

export default function PackingList({ items }) {
  const handleToggle = (cat, idx) => {
    console.log(`Toggled ${items[cat][idx]} in ${cat}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Packing Checklist</h2>
      {Object.entries(items).map(([category, things]) => (
  <div key={category} className="mb-4">
    <h3 className="text-xl font-semibold text-blue-700 mb-2">{category} 🗂️</h3>
    <ul className="list-disc list-inside pl-4 space-y-1">
      {things.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
  
))}
</div>
  );
}