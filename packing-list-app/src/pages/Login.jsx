import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; 
import "./Login.css";
import Navbar from "../components/Navbar";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      navigate("/trip");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page d-flex align-items-center justify-content-center text-white">
        <div className="login-container p-4 rounded shadow-lg">
          <h3 className="mb-3 text-center">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control custom-input"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control custom-input"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline-light w-100">
              Login
            </button>

            <p className="mt-3 text-center">
                  Dont have an account? <Link to="/Signup" className="text-light">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
