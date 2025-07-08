import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trips", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTrips(data.reverse());
        } else {
          alert("Failed to fetch trips.");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to backend.");
      }
    };

    fetchTrips();
  }, []);

  const exportToPDF = (trip) => {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(14);
    doc.text("Trip Summary", 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Destination: ${trip.destination}`, 14, y);
    y += 6;
    doc.text(`Trip Type: ${trip.type}`, 14, y);
    y += 6;
    doc.text(`Days: ${trip.days}`, 14, y); // ✅ fixed this field
    y += 10;

    // Itinerary notes
    if (trip.notes?.length > 0) {
      doc.setFontSize(13);
      doc.text("Itinerary Notes", 14, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        head: [["Day", "Plan"]],
        body: trip.notes.map((note, idx) => [`Day ${idx + 1}`, note || "-"]),
      });

      y = doc.lastAutoTable.finalY + 10;
    }

    // Packed Items
    const packedItems = trip.packedItems || {};
    const customItems = trip.customItems || {};

    doc.setFontSize(13);
    doc.text("Packed Items", 14, y);
    y += 4;

    // Combine packedItems and customItems into one table
    const allCategories = new Set([
      ...Object.keys(packedItems),
      ...Object.keys(customItems),
    ]);

    for (let category of allCategories) {
      const items = [...(packedItems[category] || []), ...(customItems[category] || [])];
      if (items.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [[category]],
          body: items.map((item) => [item]),
        });
        y = doc.lastAutoTable.finalY + 8;
      }
    }

    doc.save(`Packing_List_${trip.destination || "Trip"}.pdf`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #181818, #222831)",
      animation: "floatBg 10s ease-in-out infinite",
    }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 shadow-sm" style={{ backdropFilter: "blur(10px)" }}>
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="/">
            Virtual Packing List
          </a>
        </div>
      </nav>

      <div className="container py-5">
        <div className="mx-auto text-white p-4 rounded-4 shadow" style={{
          maxWidth: "800px",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(12px)",
          fontSize: "0.95rem",
        }}>
          <h4 className="text-center fw-bold mb-4">Saved Trips</h4>

          {trips.length === 0 ? (
            <p className="text-center">No trips saved yet.</p>
          ) : (
            trips.map((trip, index) => (
              <div key={trip._id || index} className="card bg-dark bg-opacity-50 text-white mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">Trip {trips.length - index}</h5>
                  <p className="mb-1"><strong>Destination:</strong> {trip.destination}</p>
                  <p className="mb-1"><strong>Type:</strong> {trip.type}</p>
                  <p className="mb-0"><strong>Days:</strong> {trip.days}</p>
                  <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => exportToPDF(trip)}>
                    Download PDF
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="text-center mt-4">
            <Link to="/trip" className="btn btn-outline-light btn-sm">Start a New Trip</Link>
          </div>
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