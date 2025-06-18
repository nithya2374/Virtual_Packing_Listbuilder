import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TripForm from './components/Tripform';
import PackingList from './components/PackingList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import templates from './data/templates';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trip" element={<TripForm onSubmit={() => {}} />} />
          <Route path="/packing-list" element={<PackingList items={templates['Vacation']} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
