import { Link } from "react-router-dom";
import "./Home.css";

export default function HomePage() {
  return (
    <div className="hero-section d-flex flex-column justify-content-center align-items-center text-white text-center vh-100">
      <h1 className="display-5 fw-bold mb-3 fade-in-up">Plan Your Perfect Trip</h1>
      <p className="lead mb-4 fw-semibold fade-in-up delay-1s">
        Smart packing made easy – customize your checklist now
      </p>
      <Link to="/trip" className="btn btn-outline-light px-3 py-2 small-btn fade-in-up delay-2s">
        Get Started
      </Link>
    </div>
  );
}
