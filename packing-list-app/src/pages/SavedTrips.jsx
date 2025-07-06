import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("tripHistory")) || [];
    setTrips(history.reverse());
  }, []);

  const exportToPDF = (tripData, itinerary, packingData, customItems, packedStatus) => {
  const doc = new jsPDF();
  let y = 15;

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
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 shadow-sm"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="/">
            Virtual Packing List
          </a>
        </div>
      </nav>

      {/* Page Content */}
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
          <h4 className="text-center fw-bold mb-4">Saved Trips</h4>

          {trips.length === 0 ? (
            <p className="text-center">No trips saved yet.</p>
          ) : (
            trips.map((trip, index) => (
              <div
                key={index}
                className="card bg-dark bg-opacity-50 text-white mb-3 shadow-sm"
              >
                <div className="card-body">
                  <h5 className="card-title fw-semibold">Trip {trips.length - index}</h5>
                  <p className="mb-1"><strong>Destination:</strong> {trip.destination}</p>
                  <p className="mb-1"><strong>Type:</strong> {trip.type}</p>
                  <p className="mb-0"><strong>Days:</strong> {trip.days}</p>
                  <button className="btn btn-outline-danger btn-sm mt-2"  onClick={() => {
                     const itinerary = JSON.parse(localStorage.getItem("itinerary_" + trip.type)) || [];
                     const templates = JSON.parse(localStorage.getItem("templates")) || {};
                     const packingData = templates[trip.type] || {};
                     const customItems = JSON.parse(localStorage.getItem("customItems_" + trip.type)) || {};
                     const packedStatus = JSON.parse(localStorage.getItem("packedStatus_" + trip.type)) || {};

                   exportToPDF(trip, itinerary, packingData, customItems, packedStatus);
                   }}>Download PDF</button>

                </div>
              </div>
            ))
          )}

          <div className="text-center mt-4">
            <Link to="/trip" className="btn btn-outline-light btn-sm">
               Start a New Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Background Animation */}
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
