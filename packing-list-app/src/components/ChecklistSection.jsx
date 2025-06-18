export default function ChecklistSection({ title, items, toggleItem }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h3 className="card-title h5 mb-3">{title} 🗂️</h3>
        <ul className="list-unstyled">
          {items.map((item, i) => (
            <li key={i} className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input me-2"
                onChange={() => toggleItem(i)}
                id={`check-${i}`}
              />
              <label className="form-check-label" htmlFor={`check-${i}`}>
                {item}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )}