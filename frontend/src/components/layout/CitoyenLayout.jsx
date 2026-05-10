import { useState } from 'react';
import { logout } from '../../services/auth';
import PointsDeCollecte from '../../pages/citoyen/PointsDeCollecte';
import Signalement from '../../pages/citoyen/Signalement';
import SuiviSignalements from '../../pages/citoyen/SuiviSignalements';
import MesRecompenses from '../../pages/citoyen/MesRecompenses';

const MENU = [
  { id: 'points',       label: 'Points de collecte',  icon: '📍' },
  { id: 'signaler',     label: 'Signaler un incident', icon: '⚠️' },
  { id: 'signalements', label: 'Mes signalements',     icon: '📋' },
  { id: 'recompenses',  label: 'Mes recompenses',      icon: '🏆' },
];

export default function CitoyenLayout({ user, onUserUpdate }) {
  const [page, setPage] = useState('points');

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 bg-[#0D1B2A] flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="text-[#00C896] font-bold text-xl">EcoTrack</div>
          <div className="text-gray-400 text-sm">Espace Citoyen</div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {MENU.map(m => (
            <button
              key={m.id}
              onClick={() => setPage(m.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors
                ${page === m.id
                  ? 'bg-[#00C896] text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              <span>{m.icon}</span>
              <span className="text-sm">{m.label}</span>
            </button>
          ))}
        </nav>

        {/* Profil en bas */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#00C896] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.initiales}
            </div>
            <div>
              <div className="text-white text-sm font-medium">{user.nom}</div>
              <div className="text-[#00C896] text-xs font-medium">🏆 {user.points || 0} pts</div>
            </div>
          </div>
          <div className="text-gray-500 text-xs mb-3">Citoyen</div>
          <button
            onClick={logout}
            className="text-gray-400 text-sm hover:text-white flex items-center gap-2 transition-colors">
            ↪ Deconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">

        {/* Header page */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <h1 className="text-lg font-bold text-gray-800">
            {MENU.find(m => m.id === page)?.icon} {MENU.find(m => m.id === page)?.label}
          </h1>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {page === 'points'       && <PointsDeCollecte user={user} />}
          {page === 'signaler'     && <Signalement user={user} onUserUpdate={onUserUpdate} />}
          {page === 'signalements' && <SuiviSignalements user={user} />}
          {page === 'recompenses'  && <MesRecompenses user={user} />}
        </div>
      </div>

    </div>
  );
}