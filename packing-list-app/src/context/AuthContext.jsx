import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores current user object

  // Check if user is logged in on page load
  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/me",  { 
         withCredentials :true
      ,})

      .then(res => {
        setUser(res.data.user); // Set user from backend if token is valid
      })

      .catch(() => {
        setUser(null); // Not logged in or token expired
      });
   
  }, []);

  const login = (userData) => {
    setUser(userData); // Set user after login
  };

  const logout = () => {
    setUser(null); // Clear user
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
