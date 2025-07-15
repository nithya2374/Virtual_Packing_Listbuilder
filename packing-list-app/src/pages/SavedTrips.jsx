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
        const res = await fetch("http://localhost:5000/api/trips/fetchall", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setTrips(data);
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
    doc.text(`Days: ${trip.days}`, 14, y); 
    y += 6;
    doc.text(`Date: ${new Date(trip.createdAt).toLocaleDateString()}`, 14, y);
    y += 10;

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

    const packedItems = trip.packedItems || {};
    const customItems = trip.customItems || {};

    const combined = {};

    for (let cat in packedItems) {
      const items = packedItems[cat];
      if (Array.isArray(items)) {
        combined[cat] = items;
      } else {
        combined[cat] = Object.entries(items)
          .filter(([_, isPacked]) => isPacked)
          .map(([item]) => item);
      }
    }

    for (let cat in customItems) {
      if (!combined[cat]) combined[cat] = [];
      combined[cat].push(...customItems[cat]);
    }

    doc.setFontSize(13);
    doc.text("Packed Items", 14, y);
    y += 4;

    for (let cat of Object.keys(combined)) {
      const items = combined[cat];
      if (items.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [[cat]],
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
            [...trips]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((trip, index) => (
                <div key={trip._id || index} className="card bg-dark bg-opacity-50 text-white mb-3 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">Trip {trips.length - index}</h5>
                    <p className="mb-1"><strong>Destination:</strong> {trip.destination}</p>
                    <p className="mb-1"><strong>Type:</strong> {trip.type}</p>
                    <p className="mb-1"><strong>Days:</strong> {trip.days}</p>
                    <p className="mb-1"><strong>Date:</strong> {new Date(trip.createdAt).toLocaleDateString()}</p>
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
