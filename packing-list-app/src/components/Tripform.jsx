import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useTrip } from "../context/TripContext"; 

export default function TripForm() {
  const navigate = useNavigate();
  const { setTripId } = useTrip(); 
  const [trip, setTrip] = useState({
    type: "",
    destination: "",
    days: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { type, destination, days} = trip;

    if (!type|| !destination || !days) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/trips`, {
        type,
        destination,
        days:parseInt(days),
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
        
      });

      const savedTrip = response.data;
      setTripId(savedTrip._id); // store trip ID in context
      setSuccess("Trip saved successfully!");
      navigate("/packing-list"); 

    } 
    catch (error) {
      
      console.error("Trip creation failed:", error);

      if (error.response) {
          console.log("Backend responded with:", error.response.data);
          console.log("Status code:", error.response.status);
          console.log("full error messaage: ", error.response.data?.message);

       // Show more specific error message from backend if available
      const backendMessage = error.response.data?.message || "An error occurred";
      setError(`Error ${error.response.status}: ${backendMessage}`);
  } 
  else if (error.request) {
      console.log("Request was made but no response received:", error.request);
       setError("No response received from server");
  } else {
      console.log("Error setting up request:", error.message);
      setError("Error in request setup: " + error.message);
  }
}
  
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
      <Navbar/>
      <div
        className="trip-page d-flex justify-content-center align-items-start text-white"
        style={{
          minHeight: "100vh",
          paddingTop: "90px",
          paddingBottom: "80px",
          backgroundColor: "#1F2D3D",
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

            {error && <p className="text-danger text-center">{error}</p>}
            {success && <p className="text-success text-center">{success}</p>}

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