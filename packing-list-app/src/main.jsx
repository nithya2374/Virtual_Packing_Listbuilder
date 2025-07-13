
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from "./context/TripContext"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
   <TripProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
   </TripProvider> 
  </HashRouter>
);
