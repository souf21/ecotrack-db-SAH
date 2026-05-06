import { useState } from 'react';
import { logout } from '../../services/auth';

// Imports corrigés
import CollecteEnCours from '../../pages/agent/CollecteEnCours';   // ← Nom corrigé
import Tournees from '../../pages/agent/Tournees';

const MENU = [
  { id: 'points',       label: 'Points de collecte', icon: '📍' },
  { id: 'collecte',     label: 'Collecte en cours',  icon: '🚛' },
  { id: 'tournees',     label: 'Mes tournées',       icon: '🗺️' },
  { id: 'signalements', label: 'Signalements',       icon: '⚠️' },
];

export default function AgentLayout({ user }) {
  const [page, setPage] = useState('points');

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 bg-[#0D1B2A] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="text-[#00C896] font-bold text-xl">EcoTrack</div>
          <div className="text-gray-400 text-sm">Espace Agent de Collecte</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {MENU.map(m => (
            <button
              key={m.id}
              onClick={() => setPage(m.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors
                ${page === m.id 
                  ? 'bg-[#00C896] text-white font-medium' 
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            >
              <span>{m.icon}</span>
              <span className="text-sm">{m.label}</span>
            </button>
          ))}
        </nav>

        {/* Profil Agent */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#00C896] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.initiales || 'AG'}
            </div>
            <div>
              <div className="text-white text-sm font-medium">{user.nom}</div>
              <div className="text-[#00C896] text-xs">Agent de collecte</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 text-sm hover:text-white flex items-center gap-2"
          >
            ↪ Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-800">
            {MENU.find(m => m.id === page)?.icon} {MENU.find(m => m.id === page)?.label}
          </h1>
        </div>

        <div className="p-6">
          {page === 'points' && <CollecteEnCours />}           {/* ← Corrigé */}
          {page === 'collecte' && <div className="text-gray-500 py-12 text-center">Collecte en cours — en développement...</div>}
          {page === 'tournees' && <Tournees />}
          {page === 'signalements' && <div className="text-gray-500 py-12 text-center">Signalements — en développement...</div>}
        </div>
      </div>
    </div>
  );
}