export default function ChecklistSection({
  title,
  items,
  packedStatus,
  toggleItem,
  removeItem,
  templates = [],
  addItem,
}) {
  const isCustom = (item) => !templates.includes(item);

  return (
    <div className="card bg-dark bg-opacity-50 text-white mb-4">
      <div className="card-header fw-semibold">{title}</div>

      <ul className="list-group list-group-flush">
        {items.map((item, i) => (
          <li
            key={i}
            className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white"
          >
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={!!packedStatus[item]}
                onChange={() => toggleItem(item)}
              />
              {item}
            </label>

            {isCustom(item) && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeItem(i - templates.length)}
              >
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="card-footer bg-transparent">
        <form
          className="d-flex"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.elements[`newItem-${title}`];
            addItem(title, input.value);
            input.value = "";
          }}
        >
          <input
            name={`newItem-${title}`}
            type="text"
            className="form-control form-control-sm me-2"
            placeholder={`Add item to ${title}`}
          />
          <button className="btn btn-outline-light btn-sm" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
