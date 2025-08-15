import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; 
import "./Signup.css";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Signup() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    password: "",
    contact:""
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password ,firstname,contact} = formData;

    if (!firstname || !email || !password || !contact) {
        alert("All fields are required");
        return;
    } 
    else if (password.length < 6) {
         alert("Password must be at least 6 characters");
         return;
    }
    else if (!/^\d{10}$/.test(contact)) {
          alert("Contact must be a valid 10-digit number");
          return;
    } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert("Enter a valid email address");
          return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData,
        { withCredentials: true } 
      );
    
      console.log("Signup response:", response.data);

      if (response.data.success) {

        login(response.data.user); // Save user info to context
        navigate("/login");    // Redirect after signup
      } 
      else {
        alert("Signup failed. Please try again.");
      }
    }
     catch(err) {

       console.error("Signup error:", err);
       const validationErrors = err.response?.data?.errors;
       if (validationErrors && Array.isArray(validationErrors)) {
        setError(validationErrors[0].msg); 
       }  
       else {
      setError(err.response?.data?.message || "Error signing up. Try again later.");
      }
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
                name="contact"
                className="form-control custom-input"
                required
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

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
