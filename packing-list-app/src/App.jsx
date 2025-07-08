import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TripForm from './components/Tripform';
import SavedTrips from "./pages/SavedTrips";
import PackingList from './components/PackingList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import templates from './data/templates';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/trip"
          element={
            <ProtectedRoute>
              <TripForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packing-list"
          element={
            <ProtectedRoute>
              <PackingList items={templates['Vacation']} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/saved-trips" element={<SavedTrips />} /> 
      </Routes>
    </>
  );
}

export default App;