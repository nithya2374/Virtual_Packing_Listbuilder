import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; 
import "./Signup.css";
import Navbar from "../components/Navbar";

export default function Signup() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (email && password) {
      login(email); // Simulate login after signup
      navigate("/trip");
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-page d-flex align-items-center justify-content-center text-white">
        <div className="signup-container p-4 rounded shadow-lg">
          <h3 className="mb-3 text-center">Sign Up</h3>
          <form onSubmit={handleSignup}>
            <div className="mb-3 text-start">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstname"
                className="form-control custom-input"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control custom-input"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control custom-input"
                required
                onChange={handleChange}
              />
            </div>
             <div className="mb-3 text-start">
              <label className="form-label">Contact</label>
              <input
                type="number"
                name="Contact"
                className="form-control custom-input"
                required
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-outline-light w-100">
              Sign Up
            </button>
            <p className="mt-3 text-center">
                  Already have an account? <Link to="/Login" className="text-light">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
