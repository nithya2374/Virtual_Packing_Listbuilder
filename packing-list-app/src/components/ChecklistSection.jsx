export default function ChecklistSection({ title, items, toggleItem }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <h3 className="font-semibold text-lg mb-2">{title} 🗂️</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <input
              type="checkbox"
              onChange={() => toggleItem(i)}
              className="mr-2"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}