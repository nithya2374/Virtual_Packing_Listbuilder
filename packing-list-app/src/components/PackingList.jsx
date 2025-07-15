import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import templates from "../data/templates";
import ChecklistSection from "../components/ChecklistSection";
import Navbar from "../components/Navbar";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function PackingList() {
  const [tripType, setTripType] = useState("");
  const [packingData, setPackingData] = useState({});
  const [trip, setTrip] = useState({});
  const [customItems, setCustomItems] = useState({});
  const [packedStatus, setPackedStatus] = useState({});
  const [notes, setNotes] = useState([]);
  const [noteSaved, setNoteSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data } = await axios.get("/api/trips/latest", { withCredentials: true });
        const latest = data;

        setTrip(latest);
        setTripType(latest.type);
        setCustomItems(latest.customItems || {});
        setPackedStatus(latest.packedItems || {});
        setNotes(latest.notes?.length ? latest.notes : Array(latest.days).fill(""));

        const defaultData = templates[latest.type];
        setPackingData(defaultData);
      } 
      catch (err) {
        console.error("Failed to fetch trip", err);
        navigate("/trip");
      }
    };
    fetchTrip();

    // Animate float effect
    const keyframes = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
      }
    `;
    const style = document.createElement("style");
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleCheckboxChange = (category, item) => {
    const updated = { ...packedStatus };
    updated[category] = { ...(updated[category] || {}), [item]: !updated[category]?.[item] };
    setPackedStatus(updated);
  };

  const handleNoteChange = (value, index) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = value;
    setNotes(updatedNotes);
  };


  const saveNotes = async () => {
  try {
    await axios.put(`/api/trips/${trip._id}`, {
      notes,
      customItems,
      packedItems: packedStatus,
    }, { withCredentials: true });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  } 
  catch (err) {
    console.error("Failed to save notes", err);
  }
  };

  const exportList = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Packing List for ${tripType}`, 10, 10);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Type: ${trip.type}`, 10, 20);
  doc.text(`Destination: ${trip.destination}`, 10, 27);
  doc.text(`Total Days: ${trip.days}`, 10, 34);

  let y = 44;

  doc.setFont("helvetica", "bold");
  doc.text("Itinerary Notes:", 10, y);
  y += 7;

  notes.forEach((note, index) => {
    doc.setFont("helvetica", "normal");
    doc.text([`Day ${index + 1}: ${note || "No notes"}`], 10, y);
    y += 6;
  });

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Packed Items Only:", 10, y);
  y += 7;

  const fullPacking = {
    ...packingData,
    ...Object.fromEntries(
      Object.entries(customItems).map(([cat, items]) => [
        cat,
        [...(packingData[cat] || []), ...items],
      ])
    ),
  };

  Object.entries(fullPacking).forEach(([category, items]) => {
    const packedItems = items.filter(item => packedStatus[category]?.[item]);
    if (packedItems.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text(`${category}:`, 10, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      packedItems.forEach(item => {
        doc.text([`- ${item}`], 15, y);  
        y += 6;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });
    }
  });

  doc.save("PackedItems.pdf");
};

  return (
    <>
      <Navbar />
      <div
        className="packing-page d-flex justify-content-center align-items-start text-white"
        style={{
          minHeight: "100vh",
          paddingTop: "90px",
          paddingBottom: "80px",
          backgroundColor: "#1F2D3D",
        }}
      >
        <div
          className="packing-container"
          style={{
            animation: "float 4s ease-in-out infinite",
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "12px",
            maxWidth: "800px",
            width: "95%",
            padding: "24px",
            fontSize: "0.9rem",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="text-center mb-4">
            <h4 className="fw-bold">Packing List for {tripType}</h4>
            <button className="btn btn-success btn-sm mt-2" onClick={exportList}>
              Export List as PDF
            </button>
          </div>

          <div className="bg-light text-dark p-3 rounded-3 mb-4">
            <h5 className="fw-bold">Trip Summary</h5>
            <p><strong>Type:</strong> {trip.type}</p>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Total Days:</strong> {trip.days}</p>
          </div>

          <div className="bg-dark bg-opacity-25 p-3 rounded-3 mb-4 text-white">
            <h6 className="fw-bold">Itinerary Notes</h6>
            {notes.map((note, index) => (
              <div key={index} className="mb-3">
                <label className="form-label">Day {index + 1}</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value, index)}
                  placeholder={`Enter plan for Day ${index + 1}`}
                />
              </div>
            ))}
            <button className="btn btn-primary btn-sm mt-2" onClick={saveNotes}>
              Save Notes
            </button>
            {noteSaved && <p className="text-success small mt-2">Notes saved</p>}
          </div>

          {packingData && Object.entries({
              ...packingData,
              ...Object.fromEntries(
              Object.entries(customItems).map(([cat, items]) => [cat, [...(packingData[cat] || []), ...items], ]))
             }).map(([category, items]) => (
  <          ChecklistSection
             key={category}
             title={category}
             items={items}
             packedStatus={packedStatus[category] || {}}
             templates={packingData[category] || []}
             toggleItem={(item) => handleCheckboxChange(category, item)}
             addItem={(cat, item) => {
                  const updated = { ...customItems };
                  updated[cat] = [...(updated[cat] || []), item];
                  setCustomItems(updated);
            }}
            removeItem={(index) => {
                  const updated = { ...customItems };
                  updated[category] = [...(updated[category] || [])];
                  updated[category].splice(index, 1);
                 setCustomItems(updated);
            }}
         />
       ))}

        </div>
      </div>
    </>
  );
}
