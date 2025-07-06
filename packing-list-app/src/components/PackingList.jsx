import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import
import templates from "../data/templates";

export default function PackingList() {
  const [tripType, setTripType] = useState("");
  const [tripData, setTripData] = useState({});
  const [itinerary, setItinerary] = useState([]);
  const [packingData, setPackingData] = useState({});
  const [customItems, setCustomItems] = useState({});
  const [packedStatus, setPackedStatus] = useState({});

  useEffect(() => {
    const trip = JSON.parse(localStorage.getItem("tripData"));
    if (trip?.type) {
      setTripType(trip.type);
      setTripData(trip);

      const data = templates[trip.type] || {};
      setPackingData(data);

      const custom = JSON.parse(localStorage.getItem("customItems_" + trip.type)) || {};
      setCustomItems(custom);

      const packed = JSON.parse(localStorage.getItem("packedStatus_" + trip.type)) || {};
      setPackedStatus(packed);

      const savedItinerary = JSON.parse(localStorage.getItem("itinerary_" + trip.type)) || [];
      setItinerary(savedItinerary);
    }
  }, []);

  const handleAddItem = (category, item) => {
    if (!item.trim()) return;
    const updated = {
      ...customItems,
      [category]: [...(customItems[category] || []), item],
    };
    setCustomItems(updated);
    localStorage.setItem("customItems_" + tripType, JSON.stringify(updated));
  };

  const handleRemoveItem = (category, index) => {
    const updated = { ...customItems };
    updated[category].splice(index, 1);
    setCustomItems(updated);
    localStorage.setItem("customItems_" + tripType, JSON.stringify(updated));
  };

  const handleCheckboxChange = (item) => {
    const updated = {
      ...packedStatus,
      [item]: !packedStatus[item],
    };
    setPackedStatus(updated);
    localStorage.setItem("packedStatus_" + tripType, JSON.stringify(updated));
  };

  const handleItineraryChange = (index, value) => {
    const updated = [...itinerary];
    updated[index] = value;
    setItinerary(updated);
    localStorage.setItem("itinerary_" + tripType, JSON.stringify(updated));
  };

  //  FIXED PDF Export Function
  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 15;

    // Trip Summary
    doc.setFontSize(14);
    doc.text("Trip Summary", 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Destination: ${tripData.destination}`, 14, y);
    y += 6;
    doc.text(`Trip Type: ${tripData.type}`, 14, y);
    y += 6;
    doc.text(`Days: ${tripData.days}`, 14, y);
    y += 10;

    // Itinerary Notes
    if (itinerary.length > 0) {
      doc.setFontSize(13);
      doc.text("Itinerary Notes", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Day", "Plan"]],
        body: itinerary.map((note, idx) => [`Day ${idx + 1}`, note || "-"]),
      });

      y = doc.lastAutoTable.finalY + 10;
    }

    // Packed Items Table
    doc.setFontSize(13);
    doc.text("Packed Items", 14, y);
    y += 4;

    Object.entries(packingData).forEach(([category, items]) => {
      const allItems = [...items, ...(customItems[category] || [])];
      const packedItems = allItems.filter((item) => packedStatus[item]);

      if (packedItems.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [[category]],
          body: packedItems.map((item) => [item]),
        });
        y = doc.lastAutoTable.finalY + 8;
      }
    });

    doc.save(`Packing_List_${tripData.destination || "Trip"}.pdf`);
  };

  return (
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
          <div className="card bg-dark text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Trip Summary</h5>
              <p><strong>Destination:</strong> {tripData.destination}</p>
              <p><strong>Trip Type:</strong> {tripData.type}</p>
              <p><strong>Days:</strong> {tripData.days}</p>
            </div>
          </div>

          <div className="card bg-dark text-white mb-4">
            <div className="card-body">
              <h5 className="card-title">Itinerary Notes</h5>
              {Array.from({ length: tripData.days || 0 }).map((_, index) => (
                <div key={index} className="mb-2">
                  <label>Day {index + 1}:</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mt-1"
                    value={itinerary[index] || ""}
                    onChange={(e) => handleItineraryChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-4">
            <h4 className="fw-bold">Packing List for {tripType}</h4>
            <button className="btn btn-danger btn-sm mt-2" onClick={exportToPDF}>
              Export to PDF
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
                        onClick={() => handleRemoveItem(category, idx - items.length)}
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
  );
}
