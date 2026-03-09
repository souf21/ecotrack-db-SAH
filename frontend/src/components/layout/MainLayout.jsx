import React from 'react';
import { LayoutDashboard, Trash2, Map, Settings, LogOut } from 'lucide-react';

const MainLayout = ({ children }) => {
  // Liste des éléments du menu pour la Sidebar
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <Map size={20} />, label: 'Carte des conteneurs', active: false },
    { icon: <Trash2 size={20} />, label: 'Collectes', active: false },
    { icon: <Settings size={20} />, label: 'Paramètres', active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-600 tracking-tight">EcoTrack</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active 
                ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                : 'text-gray-500 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bouton de déconnexion en bas */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* --- ZONE DE DROITE (Header + Contenu) --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Pages /</span>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Tableau de bord</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-none">Ali Haidar</p>
              <p className="text-xs text-gray-500 mt-1">Administrateur</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold border-2 border-green-100 shadow-sm">
              AH
            </div>
          </div>
        </header>

        {/* CONTENU DE LA PAGE (Ce qui changera selon l'onglet) */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;