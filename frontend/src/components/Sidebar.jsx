import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../pages/Dashboard.css';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: isActive(path) ? '#3498db' : 'white',
  });

  return (
    <div className="sidebar">
      <h3>EcoTrack</h3>
      <ul>
        <li>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>📊 Dashboard</Link>
        </li>
        <li>
          <Link to="/report" style={linkStyle('/report')}>🚩 Signalement</Link>
        </li>
        <li>
          <span>⚙️ Paramètres</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
