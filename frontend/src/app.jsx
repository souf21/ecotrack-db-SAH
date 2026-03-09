import React, { useState } from 'react';
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';

function App() {
  // 1. On crée l'interrupteur (false = pas connecté, true = connecté)
  const [isConnected, setIsConnected] = useState(false);

  // 2. La fonction qui simule la connexion
  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <>
      {/* 3. Si isConnected est vrai, on montre le Dashboard, sinon le Login */}
      {isConnected ? (
        <MainLayout>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue sur votre Dashboard</h3>
            <p className="text-gray-500">Connexion réussie ! Vos données s'afficheront ici.</p>
          </div>
        </MainLayout>
      ) : (
        <Login onLoginSuccess={handleConnect} />
      )}
    </>
  );
}

export default App;