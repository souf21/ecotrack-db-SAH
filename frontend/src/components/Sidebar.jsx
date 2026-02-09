import React from 'react';
import '../pages/Dashboard.css'; // On réutilise le CSS existant

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>EcoTrack</h3>
      <ul>
        <li>📊 Dashboard</li>
        <li>📍 Carte des conteneurs</li>
        <li>⚙️ Paramètres</li>
      </ul>
    </div>
  );
};

export default Sidebar;