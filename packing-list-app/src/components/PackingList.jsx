import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import templates from "../data/templates";
import axios from "axios";

export default function PackingList() {
  const [tripType, setTripType] = useState("");
  const [packingData, setPackingData] = useState({});
  const [customItems, setCustomItems] = useState({});
  const [packedStatus, setPackedStatus] = useState({});
  const [tripId, setTripId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const trips = res.data;
        if (trips.length === 0) return;

        const latest = trips[trips.length - 1];
        setTripType(latest.type);
        setTripId(latest._id);
        setCustomItems(latest.customItems || {});
        setPackedStatus(latest.packedItems || {});

        const template = templates[latest.type] || {};
        setPackingData(template);
      } catch (err) {
        console.error("Failed to load trip:", err);
        alert("Please login again");
        navigate("/login");
      }
    };

    fetchTrip();
  }, [navigate]);

  const updateTrip = async (updates) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/trips/${tripId}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Failed to update trip:", err);
    }
  };

  const handleAddItem = (category, item) => {
    if (!item.trim()) return;
    const updated = {
      ...customItems,
      [category]: [...(customItems[category] || []), item],
    };
    setCustomItems(updated);
    updateTrip({ customItems: updated });
  };

  const handleRemoveItem = (category, index) => {
    const updated = { ...customItems };
    updated[category].splice(index, 1);
    setCustomItems(updated);
    updateTrip({ customItems: updated });
  };

  const handleCheckboxChange = (item) => {
    const updated = {
      ...packedStatus,
      [item]: !packedStatus[item],
    };
    setPackedStatus(updated);
    updateTrip({ packedItems: updated });
  };

  const exportList = () => {
    let content = `Packing List for ${tripType}\n\n`;
    Object.entries(packingData).forEach(([category, items]) => {
      content += `${category}:\n`;
      items.forEach((item) => (content += `- ${item}\n`));
      (customItems[category] || []).forEach((item) => (content += `- ${item}\n`));
      content += `\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Packing_List_${tripType}.txt`;
    link.click();
  };

  return (
    <>
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #181818, #222831)",
        animation: "floatBg 10s ease-in-out infinite",
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            Virtual Packing List
          </a>
        </div>
      </nav>

      <div className="container py-5">
        <div
          className="mx-auto text-white p-4 rounded-4 shadow"
          style={{
            maxWidth: "800px",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            fontSize: "0.95rem",
          }}
        >
          <div className="text-center mb-4">
            <h4 className="fw-bold">Packing List for {tripType}</h4>
            <button className="btn btn-success btn-sm mt-2" onClick={exportList}>
              Export List
            </button>
          </div>

          {Object.entries(packingData).map(([category, items]) => (
            <div className="card bg-dark bg-opacity-50 text-white mb-4" key={category}>
              <div className="card-header fw-semibold">{category}</div>
              <ul className="list-group list-group-flush">
                {[...items, ...(customItems[category] || [])].map((item, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white"
                  >
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={!!packedStatus[item]}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      {item}
                    </label>
                    {customItems[category]?.includes(item) && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleRemoveItem(category, idx - items.length)
                        }
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
                    const input = e.target.elements[`newItem-${category}`];
                    handleAddItem(category, input.value);
                    input.value = "";
                  }}
                >
                  <input
                    name={`newItem-${category}`}
                    type="text"
                    className="form-control form-control-sm me-2"
                    placeholder={`Add item to ${category}`}
                  />
                  <button className="btn btn-outline-light btn-sm" type="submit">
                    Add
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes floatBg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
    </>
  );
}