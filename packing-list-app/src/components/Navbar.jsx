import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const logoutHandler = async () => {
      await axios.post("/api/auth/logout", { withCredentials: true });
      logout(); // Clears context
      navigate('/login');
   };

  return (
    <>
      <nav
        className="navbar fixed-top py-2"
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold text-light" to="/">
           ✈️ Packing Pro
          </Link>

          {/* Toggle for mobile */}
          <button className="navbar-toggler d-md-none" type="button" onClick={toggleSidebar}>
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop links */}
          <div className="d-none d-md-flex gap-4 align-items-center ms-auto">
            <Link className="nav-link text-light fw-semibold nav-hover" to="/"><i className="bi bi-house" ></i> Home</Link>
            {user ? (
              <>
                <Link className="nav-link text-light fw-semibold nav-hover" to="/trip"><i className="bi bi-geo-alt"></i> Trip</Link>
                <Link className="nav-link text-light fw-semibold nav-hover" to="/packing-list"><i className="bi bi-list-check"></i> List</Link>
                <Link className="nav-link text-light fw-semibold nav-hover" to="/saved-trips"><i className="bi bi-journal-bookmark"></i> Savedtrips</Link>

                <button className="btn btn-link nav-link fw-semibold text-danger p-0" onClick={logoutHandler}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link text-light fw-semibold nav-hover" to="/login"><i className="bi bi-box-arrow-in-right"></i> Login</Link>
                <Link className="nav-link text-light fw-semibold nav-hover" to="/signup"><i className="bi bi-person-plus"></i> Signup</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? "open" : ""}`} onClick={closeSidebar}>
        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-close ms-auto" onClick={closeSidebar}></button>
          <ul className="list-unstyled mt-4">
            <li><Link className="sidebar-link" to="/" onClick={closeSidebar}><i className="bi bi-house me-2"></i>Home</Link></li>
            {user ? (
              <>
                <li><Link className="sidebar-link" to="/trip" onClick={closeSidebar}><i className="bi bi-geo-alt me-2"></i>Trip</Link></li>
                <li><Link className="sidebar-link" to="/packing-list" onClick={closeSidebar}><i className="bi bi-list-check me-2"></i>List</Link></li>
                <li><Link className="sidebar-link" to="/saved-trips" onClick={closeSidebar}><i className="bi bi-journal-bookmark me-2"></i>Savedtrips</Link></li>

                <li>
                  <button className="btn btn-link sidebar-link text-danger p-0" onClick={() => { logoutHandler(); closeSidebar(); }}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link className="sidebar-link" to="/login" onClick={closeSidebar}><i className="bi bi-box-arrow-in-right me-2"></i>Login</Link></li>
                <li><Link className="sidebar-link" to="/signup" onClick={closeSidebar}><i className="bi bi-person-plus me-2"></i>Signup</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
