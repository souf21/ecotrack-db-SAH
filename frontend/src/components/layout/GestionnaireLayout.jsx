import { useState } from 'react';

import { logout } from '../../services/auth';

import Conteneurs from '../../pages/gestionnaire/Conteneurs';

const MENU = [

  { id: 'dashboard',    label: 'Dashboard',    icon: '📊' },

  { id: 'conteneurs',   label: 'Conteneurs',   icon: '🗑️' },

  { id: 'tournees',     label: 'Tournees',     icon: '🗺️' },

  { id: 'signalements', label: 'Signalements', icon: '⚠️' },

  { id: 'analytics',    label: 'Analytics',    icon: '📈' },

];

export default function GestionnaireLayout({ user }) {

  const [page, setPage] = useState('dashboard');

  return (

    <div className="flex h-screen bg-gray-50">

      <div className="w-64 bg-[#0D1B2A] flex flex-col">

        <div className="p-6 border-b border-gray-700">

          <div className="text-[#00C896] font-bold text-xl">EcoTrack</div>

          <div className="text-gray-400 text-sm">Espace Gestionnaire</div>

        </div>

        <nav className="flex-1 p-4 space-y-1">

          {MENU.map(m => (

            <button key={m.id} onClick={() => setPage(m.id)}

              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors

                ${page === m.id

                  ? 'bg-[#00C896] text-white font-medium'

                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>

              <span>{m.icon}</span>

              <span className="text-sm">{m.label}</span>

            </button>

          ))}

        </nav>

        <div className="p-4 border-t border-gray-700">

          <div className="text-white text-sm font-medium">{user.nom}</div>

          <div className="text-gray-400 text-xs mb-2">Gestionnaire</div>

          <button onClick={logout} className="text-gray-400 text-sm hover:text-white">

            ↪ Deconnexion

          </button>

        </div>

      </div>

      <div className="flex-1 overflow-auto p-6">

        {page === 'conteneurs' && <Conteneurs />}

        {page !== 'conteneurs' && (

          <div>

            <p className="text-2xl font-bold text-gray-800">{MENU.find(m => m.id === page)?.label}</p>

            <p className="text-gray-400 mt-2">En cours de developpement...</p>

          </div>

        )}

      </div>

    </div>

  );

}