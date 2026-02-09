import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <Routes>
        {/* Par défaut, on affiche le Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Route pour la page de connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Route pour le tableau de bord */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Route pour la formulaire */}
        <Route path="/report" element={<Report />} />

      </Routes>
    </Router>
  );
}

export default App;