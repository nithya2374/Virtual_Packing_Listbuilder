import ChecklistSection from "./ChecklistSection";

export default function PackingList({ items }) {
  const handleToggle = (cat, idx) => {
    console.log(`Toggled ${items[cat][idx]} in ${cat}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Packing Checklist</h2>
      {Object.entries(items).map(([category, list]) => (
        <ChecklistSection
          key={category}
          title={category}
          items={list}
          toggleItem={(i) => handleToggle(category, i)}
        />
      ))}
    </div>
  );
}
