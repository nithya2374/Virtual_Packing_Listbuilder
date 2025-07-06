import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";

export default function TripForm() {
  const navigate = useNavigate(); 
  const [trip, setTrip] = useState({
    type: "",
    destination: "",
    days: ""
  });

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tripData = {
    type: trip.type,
    destination: trip.destination,
    days: trip.days
  };
    //save current trip to local storage
    localStorage.setItem("tripData", JSON.stringify(tripData));

    // Save to tripHistory for SavedTrips
    const history = JSON.parse(localStorage.getItem("tripHistory")) || [];
    history.push(tripData);
    localStorage.setItem("tripHistory", JSON.stringify(history));
    
    alert("Trip data saved!");
    navigate("/packing-list"); 
  };

  useEffect(() => {
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
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="trip-page d-flex justify-content-center align-items-start text-white"
        style={{
          minHeight: "100vh",
          paddingTop: "90px",
          paddingBottom: "80px",
          backgroundColor: "#1F2D3D", // dark bluish tone matching navbar
        }}
      >
        <div
          className="trip-container"
          style={{
            animation: "float 4s ease-in-out infinite",
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "12px",
            maxWidth: "360px",
            width: "90%",
            padding: "24px",
            fontSize: "0.9rem",
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h4 className="text-center mb-3">Plan Your Trip</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Trip Type</label>
              <select
                className="form-select form-select-sm"
                name="type"
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Vacation">Vacation</option>
                <option value="Work">Work</option>
                <option value="Hike">Hike</option>
                <option value="Family">Family</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Destination</label>
              <input
                type="text"
                className="form-control form-control-sm"
                name="destination"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Duration (days)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                name="days"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-outline-light btn-sm w-100 mt-2"
            >
              Save Trip
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
