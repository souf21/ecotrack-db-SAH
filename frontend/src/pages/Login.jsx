import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import de l'outil de navigation

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialisation

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tentative de connexion avec :', { email, password });
    
    // Pour l'instant, on simule une connexion réussie
    // On redirige l'utilisateur vers le dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Connexion - EcoTrack</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email :</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label>Mot de passe :</label><br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;