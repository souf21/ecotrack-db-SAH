import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const Report = () => {
  const [containerId, setContainerId] = useState('');
  const [issueType, setIssueType] = useState('overflow');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now: simulate submit
    const payload = { containerId, issueType, description, urgency };
    console.log('Signalement envoyé :', payload);

    alert('Signalement envoyé ✅ (simulation)');
    setContainerId('');
    setIssueType('overflow');
    setDescription('');
    setUrgency('normal');
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <h1>Signalement citoyen</h1>
        <p>Signalez un problème sur un conteneur (débordement, panne, etc.).</p>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #ddd',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          maxWidth: '700px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label><b>ID du conteneur</b></label><br />
              <input
                value={containerId}
                onChange={(e) => setContainerId(e.target.value)}
                placeholder="ex: cont_123"
                required
                style={{ width: '100%', padding: '10px', marginTop: '6px' }}
              />
              <small style={{ color: '#666' }}>
                (Plus tard: sélection via carte / liste / QR code)
              </small>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label><b>Type de problème</b></label><br />
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                style={{ width: '100%', padding: '10px', marginTop: '6px' }}
              >
                <option value="overflow">Débordement</option>
                <option value="damaged">Conteneur endommagé</option>
                <option value="smell">Mauvaise odeur</option>
                <option value="sensor">Problème capteur</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label><b>Urgence</b></label><br />
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                style={{ width: '100%', padding: '10px', marginTop: '6px' }}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label><b>Description</b></label><br />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez le problème..."
                rows={5}
                style={{ width: '100%', padding: '10px', marginTop: '6px', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Envoyer le signalement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
