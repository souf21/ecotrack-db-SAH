import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

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
      </Routes>
    </Router>
  );
}

export default App;