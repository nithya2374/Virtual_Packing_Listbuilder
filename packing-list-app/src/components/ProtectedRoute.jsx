import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const { user, login } = useAuth();             // Get auth info from context
  const [loading, setLoading] = useState(true);  // Track loading status
  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        if (response.data.user) {
          login(response.data.user);
        }
      } 
      catch (err) {
        console.warn("Not authenticated:", err.response?.data?.message);
      } 
      finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [login]);

  if (loading) return <div>Loading...</div>; // Wait until we check login

  if (!user) return <Navigate to="/login" replace />; 

  return children; // Loggedin & allow access
}
