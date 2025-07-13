import heroImage from  "../assets/hero.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useAuth(); 

  return (
    <div className="hero-section d-flex flex-column justify-content-center align-items-center text-white text-center vh-100">
      
  
      <h1 className="display-5 fw-bold mb-3 fade-in-up">
        { user?.firstname ? `Welcome, ${user.firstname}!` : "Welcome to Packing Pro!"}
      </h1>

      <p className="lead mb-4 fw-semibold fade-in-up delay-1s">
        Smart packing made easy – customize your checklist now
      </p>

      <Link
        to={user ? "/trip" : "/login"}
        className="btn btn-outline-light px-3 py-2 small-btn fade-in-up delay-2s"
      >
        {user ? "Start Planning Your Trip" : "Get Started"}
      </Link>
      
    </div>
  );
}
