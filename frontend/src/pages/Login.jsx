import React from 'react';
import { Shield, Truck, Users, Recycle } from 'lucide-react';

// 1. On ajoute { onLoginSuccess } dans les parenthèses ici
const Login = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo et Titre */}
      <div className="text-center mb-8">
        <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
          <Recycle className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">EcoTrack</h1>
        <p className="text-gray-500 mt-2 font-medium">Plateforme IoT de gestion des déchets urbains</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 text-center uppercase tracking-wider">Choisissez votre profil</h3>
        
        {/* Cartes de Profil */}
        <div className="space-y-4 mb-8">
          <button className="w-full flex items-center p-4 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all group text-left focus:outline-none">
            <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-white transition-colors">
              <Shield className="text-gray-500 group-hover:text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="font-bold text-gray-800">Gestionnaire</p>
              <p className="text-xs text-gray-500">Dashboard, conteneurs, analytics</p>
            </div>
          </button>

          <button className="w-full flex items-center p-4 rounded-2xl border-2 border-green-500 bg-green-50 transition-all text-left focus:outline-none">
            <div className="bg-white p-3 rounded-xl">
              <Truck className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="font-bold text-gray-800">Agent de collecte</p>
              <p className="text-xs text-gray-500">Tournées assignées, validation</p>
            </div>
          </button>

          <button className="w-full flex items-center p-4 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all group text-left focus:outline-none">
            <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-white transition-colors">
              <Users className="text-gray-500 group-hover:text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="font-bold text-gray-800">Citoyen</p>
              <p className="text-xs text-gray-500">Signalements, points de collecte</p>
            </div>
          </button>
        </div>

        {/* Formulaire Login */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="votre@email.fr" 
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all" 
            />
          </div>

          {/* 2. On ajoute l'événement onClick ici */}
          <button 
            type="button" 
            onClick={onLoginSuccess}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-[0.98]"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;