import React from 'react';
import Sidebar from '../components/Sidebar'; // Import du nouveau composant
import Map from '../components/Map';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* On utilise le composant Sidebar ici */}
      <Sidebar />

      <div className="main-content">
        <h1>Tableau de bord</h1>
        <p>Bienvenue sur votre gestionnaire de conteneurs.</p>
        
        <div className="map-wrapper">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;